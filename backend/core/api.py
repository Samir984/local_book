import os
from datetime import datetime

from botocore.exceptions import ClientError
from django.contrib.auth import login
from django.contrib.auth import logout
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from django.db.models import Exists
from django.db.models import F
from django.db.models import OuterRef
from django.db.models import Prefetch
from django.db.models import Q
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from ninja import NinjaAPI
from ninja import PatchDict
from ninja import Query
from ninja import Router
from ninja.pagination import paginate  # type: ignore
from ninja.security import SessionAuth

from core.models import Book
from core.models import BookMark
from core.models import BookMarkItem
from core.models import Report
from core.models import User
from core.schema import BookDetailSchema
from core.schema import BookFilterScehma
from core.schema import BookMarkScehma
from core.schema import CreateBookMarkSchema  # Ensure this import exists
from core.schema import CreateBookSchema
from core.schema import GenericSchema
from core.schema import LoginSchema
from core.schema import PartialUpdateBookSchema
from core.schema import PrivateBookFilter
from core.schema import PrivateBookScehma
from core.schema import PublicBookScehma
from core.schema import RegisterSchema
from core.schema import RemoveBookMarkItemScehma
from core.schema import ReportBookSchema
from core.schema import S3GetSignedObjectURLScehma
from core.schema import S3UploadURLResponseScehma
from core.schema import UserSchema
from core.utils import ALLOWED_EXTENSIONS
from core.utils import BUCKET_NAME
from core.utils import MAX_UPLOAD_SIZE
from core.utils import MIME_TYPES
from core.utils import delete_image_from_s3
from core.utils import s3_client

# from django.db import connection


user = Router()
s3 = Router()
book = Router()
bookmark = Router()
report = Router()

session_auth = SessionAuth()

api = NinjaAPI(
    docs_url="/docs/",
    title="Book Exchange API",
    version="1.0.0",
    auth=session_auth,
)
api.add_router("/users/", user, tags=["Users"])
api.add_router("/books/", book, tags=["books"])
api.add_router("/reports/", report, tags=["reports"])
api.add_router("/bookmarks/", bookmark, tags=["bookmarks"])
api.add_router("/s3/", s3, tags=["s3"])


@user.post(
    "/register/", response={201: GenericSchema, 400: GenericSchema}, auth=None
)
def register_user(request: HttpRequest, data: RegisterSchema):
    """User registration"""

    if User.objects.filter(username=data.username).exists():
        return 400, {"detail": "Username already exists."}
    if User.objects.filter(email=data.email).exists():
        return 400, {"detail": "Email already exists."}

    user = User(
        **data.dict(exclude={"password"}),
    )

    user.set_password(data.password)
    user.save()
    return 201, {"detail": "User registered successfully."}


@user.post(
    "/login/", response={200: UserSchema, 401: GenericSchema}, auth=None
)
def login_user(request: HttpRequest, data: LoginSchema):
    """User login"""

    try:
        user = User.objects.get(email=data.email)  # Get user by email
    except User.DoesNotExist:
        return 401, {"detail": "User not found."}

    if user.check_password(data.password):
        login(request, user)
        return 200, request.user
    else:
        return 401, {"detail": "Invalid credentials."}


@user.get("/logout/", response={200: GenericSchema, 401: GenericSchema})
def logout_user(request: HttpRequest):
    """User logout"""

    if request.user.is_authenticated:
        logout(request)
        return 200, {"detail": "Logout successful."}
    else:
        return 401, {"detail": "User not logged in."}


@user.get("/me/", response={200: UserSchema, 401: GenericSchema})
def get_user(request: HttpRequest):
    if request.user.is_authenticated:
        return request.user
    else:
        return 401, {"detail": "User not logged in."}


@user.get(
    "/check-username/",
    response={200: GenericSchema, 400: GenericSchema},
    auth=None,
)
def check_username(request: HttpRequest, username: str):
    """Check for username exits for not."""
    if User.objects.filter(username=username).exists():
        return 400, {"detail": "Username already exists."}
    return 200, {"detail": "Username is available."}


# S3 file upload
@s3.post(
    "/get-upload-url",
    response={
        200: S3UploadURLResponseScehma,
        400: GenericSchema,
        500: GenericSchema,
    },
)
def get_upload_url(request: HttpRequest, filename: str):
    """Generates a pre-signed URL for uploading a file to S3."""

    name, ext = os.path.splitext(filename.lower())
    print(name, ext)
    if ext not in ALLOWED_EXTENSIONS:
        return 400, {"detail": "Invalid extension format."}

    mime_type = MIME_TYPES.get(ext)

    now = datetime.now()
    object_name = f"books/{now}-{filename}"
    try:
        response = s3_client.generate_presigned_post(
            BUCKET_NAME,
            object_name,
            Fields={"Content-Type": mime_type},
            Conditions=[
                ["content-length-range", 0, MAX_UPLOAD_SIZE],
                {"Content-Type": mime_type},
            ],
            ExpiresIn=300,
        )
        return {
            "url": response["url"],
            "fields": response["fields"],
            "key": object_name,
        }
    except ClientError as e:
        return 500, {"detail": str(e)}


@s3.delete(
    "/delete-file",
    response={200: GenericSchema, 500: GenericSchema},
)
def delete_file(request: HttpRequest, key: str):
    """Deletes a file from S3 based on its key."""
    # This return 204 ,even key is not valid.
    try:
        delete_image_from_s3(key)
    except Exception as e:
        print(e)
        return 500, {"detail": "Fail to delete image"}


@s3.get(
    "/get-image",
    response={200: S3GetSignedObjectURLScehma, 404: GenericSchema},
    auth=None,
)
def get_file_url(request: HttpRequest, key: str):
    """Generate s3 presigned url  based on its key"""
    try:
        presigned_url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": BUCKET_NAME, "Key": key},
            ExpiresIn=3600,
        )

        return {"url": f"{presigned_url}"}
    except ClientError as e:
        return 404, {"detail": str(e)}


@book.post(
    "/create/",
    response={201: GenericSchema, 400: GenericSchema, 500: GenericSchema},
)
def create_book(request: HttpRequest, data: CreateBookSchema):
    """Create book"""
    user = request.user
    book_location = None
    if (
        data.is_bachlore_book or data.is_college_book
    ) and data.grade is not None:
        return 400, {
            "detail": "Grade cannot be provided for bachelor or college books."
        }

    if data.latitude and data.longitude:
        book_location = Point(data.longitude, data.latitude, srid=4326)
        # print(book_location)

    try:
        Book.objects.create(
            user=user,
            book_image=data.book_image,
            name=data.name,
            category=data.category,
            publication=data.publication,
            edition=data.edition,
            is_school_book=data.is_school_book,
            grade=data.grade,
            is_college_book=data.is_college_book,
            is_bachlore_book=data.is_bachlore_book,
            description=data.description,
            condition=data.condition,
            price=data.price,
            latitude=data.latitude,
            longitude=data.longitude,
            location=book_location,
        )

        return 201, {
            "detail": "Book created successfully.",
        }

    except Exception as e:
        print(e)
        return 500, {
            "detail": "Failed to create book due to an unexpected error."
        }


@book.get("/", response={200: list[PublicBookScehma]}, auth=None)
@paginate
def list_books(request: HttpRequest, filters: BookFilterScehma = Query(...)):  # type: ignore
    "List books based on provided filters."
    user = request.user

    queryset = Book.objects.filter(
        # is_sold=True, is_reviewed=True ,is_accepted=True
    )

    filter_conditions = Q()
    if filters.name:
        filter_conditions &= Q(name__icontains=filters.name)
    if filters.publication:
        filter_conditions &= Q(publication__icontains=filters.publication)
    if filters.edition:
        filter_conditions &= Q(edition__icontains=filters.edition)
    if filters.grade:
        filter_conditions &= Q(grade=filters.grade)
    if filters.category:
        filter_conditions &= Q(category=filters.category)
    if filters.condition:
        filter_conditions &= Q(condition=filters.condition)

    if filters.is_school_book is not None:
        queryset = queryset.filter(is_school_book=filters.is_school_book)
    if filters.is_college_book is not None:
        queryset = queryset.filter(is_college_book=filters.is_college_book)
    if filters.is_bachlore_book is not None:
        queryset = queryset.filter(is_bachlore_book=filters.is_bachlore_book)
    if user.is_authenticated:

        queryset = queryset.annotate(
            is_bookmarked=Exists(
                BookMarkItem.objects.filter(
                    bookmark__user=user, book=OuterRef("pk")
                )
            )
        )
    queryset = queryset.annotate(
        owner_first_name=F("user__first_name"),
        owner_last_name=F("user__last_name"),
        owner_location=F("user__location"),
    )
    if filters.latitude and filters.longitude:
        user_location = Point(filters.longitude, filters.latitude, srid=4326)
        queryset = (
            queryset.filter(filter_conditions)
            .annotate(distance=Distance("location", user_location))
            .order_by("distance")
        )

        results: list[PublicBookScehma] = []
        #   this loop is for converting the distance object to string so that it can deserialized.(temp solution)
        for book in queryset:
            results.append(
                PublicBookScehma(
                    id=book.id,  # type: ignore
                    name=book.name,  # type: ignore
                    price=book.price,  # type: ignore
                    book_image=book.book_image,  # type: ignore
                    condition=book.condition,  # type: ignore
                    category=book.category,  # type: ignore
                    distance=(str(book.distance)),  # type: ignore
                    owner_first_name=book.owner_first_name,  # type: ignore
                    owner_last_name=book.owner_last_name,  # type: ignore
                    owner_location=book.owner_location,  # type: ignore
                    is_school_book=book.is_school_book,  # type: ignore
                    is_college_book=book.is_college_book,  # type: ignore
                    is_bachlore_book=book.is_bachlore_book,  # type: ignore
                    grade=book.grade,  # type: ignore
                    is_bookmarked=getattr(book, "is_bookmarked", None),  # type: ignore
                )
            )
        return results
    else:
        queryset = queryset.filter(filter_conditions)

        return queryset


@book.get("/current-users/", response={200: list[PrivateBookScehma]})
@paginate
def list_user_books(
    request: HttpRequest,
    filters: PrivateBookFilter = Query(...),  # type: ignore
):
    "Get user book"
    user = request.user
    filter_by = filters.filter_by

    queryset = Book.objects.filter(user=user).select_related("user")
    if filter_by == "sold":
        queryset = queryset.filter(is_sold=True)
    elif filter_by == "unreviewed":
        queryset = queryset.filter(is_reviewed=False)
    elif filter_by == "rejected":
        queryset = queryset.filter(is_reviewed=True, is_rejected=True)
    elif filter_by == "accepted":
        queryset = queryset.filter(is_reviewed=True, is_accepted=True)

    return queryset


@book.get(
    "/{id}/", response={200: BookDetailSchema, 404: GenericSchema}, auth=None
)
def get_book(request: HttpRequest, id: int):
    "Get book details"
    queryset = Book.objects.select_related("user")
    if request.user.is_authenticated:
        queryset = queryset.annotate(
            is_bookmarked=Exists(
                BookMarkItem.objects.filter(
                    bookmark__user=request.user, book=OuterRef("pk")
                )
            )
        )
    book = get_object_or_404(queryset, pk=id)
    return book


@book.patch(
    "/mark-as-sold/{id}/",
    response={
        200: GenericSchema,
        400: GenericSchema,
        403: GenericSchema,
        404: GenericSchema,
    },
)
def marked_as_sold(request: HttpRequest, id: int):
    user = request.user
    book = get_object_or_404(Book, id=id)

    if book.user != user:
        return 403, {"detail": "Permission denied."}

    if book.is_sold:
        return 400, {"detail": "Book is already marked as sold."}
    if not book.is_reviewed:
        return 400, {"detail": "Unreviewed book can't be mark as sold."}

    book.is_sold = True
    book.save()
    return 200, {
        "detail": "Book status update to marked as sold successfully."
    }


@book.patch(
    "/{id}/",
    response={
        200: GenericSchema,
        400: GenericSchema,
        403: GenericSchema,
        404: GenericSchema,
    },
)
def partial_update_book(
    request: HttpRequest,
    id: int,
    payload: PatchDict[PartialUpdateBookSchema],  # type: ignore
):
    """Patch book specified based on id"""
    user = request.user
    book = get_object_or_404(Book, id=id)
    if book.user != user:
        return 403, {"detail": "Permission denied."}
    if book.is_sold:
        return 400, {"detail": "You can't edit sold book."}

    if book.is_reviewed and book.is_rejected:
        return 400, {"detail": "You can't edit rejected book."}

    for attr, value in payload.items():  # type: ignore
        setattr(book, attr, value)  # type: ignore

    book.save()
    return 200, {"detail": "Book updated successfully"}


@book.delete(
    "/{id}/",
    response={
        200: GenericSchema,
        403: GenericSchema,
        404: GenericSchema,
        500: GenericSchema,
    },
)
def delete_book(request: HttpRequest, id: int):
    """Delete the book."""
    user = request.user
    book = get_object_or_404(Book, pk=id)
    if book.user != user:
        return 403, {"detail": "Permission denied."}

    try:
        delete_image_from_s3(str(book.book_image))
    except Exception as e:
        print(e)
        return 500, {"detail": "Failed to delete image."}

    book.delete()
    return 200, {"detail": "Book successfully deleted."}


@bookmark.post("/", response={201: GenericSchema, 400: GenericSchema})
def create_bookmark(request: HttpRequest, data: CreateBookMarkSchema):
    """Create book schema"""
    user = request.user
    # Bookmark is already created using signal
    book_exists = Book.objects.filter(id=data.book_id).exists()
    if not book_exists:
        return 400, {"detail": "Book does not exist."}
    # create bookmark if don't exists
    bookmark, created = BookMark.objects.get_or_create(user=user)

    if BookMarkItem.objects.filter(
        bookmark=bookmark, book_id=data.book_id
    ).exists():
        return 400, {"detail": "Book is already in your bookmark."}

    BookMarkItem.objects.create(bookmark=bookmark, book_id=data.book_id)
    return 201, {"detail": "Book added to bookmark successfully."}


@bookmark.get("/", response={200: BookMarkScehma, 404: GenericSchema})
def get_bookmark(request: HttpRequest):
    """Get bookmark"""
    user = request.user
    user_bookmarks = BookMark.objects.filter(user=user)
    if not user_bookmarks.exists():
        return 404, BookMarkScehma()

    bookmark = user_bookmarks.prefetch_related(
        Prefetch(
            "items",
            queryset=BookMarkItem.objects.select_related("book"),
        )
    ).first()
    # print(connection.queries)
    print(bookmark, "bookmark")
    return bookmark


@bookmark.delete("/", response={200: GenericSchema, 404: GenericSchema})
def remove_bookmark_item(request: HttpRequest, data: RemoveBookMarkItemScehma):
    """Remove bookmark items"""
    user = request.user
    bookmark = get_object_or_404(BookMark, user=user)
    print(bookmark, data)
    bookmark_item = get_object_or_404(
        BookMarkItem.objects.filter(bookmark=bookmark),
        book_id=data.book_id,
    )
    print(bookmark_item, "item\n")
    bookmark_item.delete()
    return 200, {"detail": "Bookmark item delete successfull."}


@report.post(
    "/report-book/",
    response={201: GenericSchema, 400: GenericSchema},
)
def report_book(request: HttpRequest, data: ReportBookSchema):
    """Report book"""
    user = request.user
    book = get_object_or_404(Book, id=data.book_id)
    Report.objects.create(
        user=user,
        book=book,
        reason=data.reason,
    )
    return 201, {"detail": "Book reported successfully."}
