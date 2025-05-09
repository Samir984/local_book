import os
from datetime import datetime

from botocore.exceptions import ClientError
from django.contrib.auth import login
from django.contrib.auth import logout
from django.contrib.gis.db.models import PointField
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.geos import Point
from django.db import IntegrityError
from django.db.models import F
from django.db.models import Q
from django.http import HttpRequest
from ninja import NinjaAPI
from ninja import Query
from ninja import Router
from ninja.pagination import paginate  # type: ignore
from ninja.security import SessionAuth

from core.models import Book
from core.models import User
from core.schema import BookFilterScehma
from core.schema import CreateBookSchema
from core.schema import GenericSchema
from core.schema import LoginSchema
from core.schema import PublicBookScehma
from core.schema import RegisterSchema
from core.schema import S3GetSignedObjectURLScehma
from core.schema import S3UploadURLResponseScehma
from core.schema import UserSchema
from core.utils import ALLOWED_EXTENSIONS
from core.utils import BUCKET_NAME
from core.utils import MAX_UPLOAD_SIZE
from core.utils import MIME_TYPES
from core.utils import s3_client

# from core.schema import BookSchema
# from core.schema import BookListSchema
# from core.schema import BookDetailSchema
# from core.schema import ReportSchema
# from core.schema import ReportListSchema
# from core.schema import RatingSchema
# from core.schema import RatingListSchema


user = Router()
book = Router()
report = Router()
rating = Router()
s3 = Router()

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
api.add_router("/ratings/", rating, tags=["ratings"])
api.add_router("/s3/", s3, tags=["s3"])


@user.post(
    "/register/", response={201: GenericSchema, 400: GenericSchema}, auth=None
)
def register_user(request: HttpRequest, data: RegisterSchema):
    """User registration"""

    if User.objects.filter(username=data.username).exists():
        return 400, {"detail": "Username already exists."}

    user = User(
        **data.dict(exclude={"password"}),
    )
    print(user)
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
    response={200: S3GetSignedObjectURLScehma, 404: GenericSchema},
)
def delete_file(request: HttpRequest, key: str):
    """Deletes a file from S3 based on its key."""
    try:
        s3_client.delete_object(Bucket=BUCKET_NAME, Key=key)
        return {"detail": "File deleted successfully"}
    except ClientError as e:
        return 404, {"detail": str(e)}


@s3.get(
    "/get-image", response={200: GenericSchema, 404: GenericSchema}, auth=None
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
    response={201: GenericSchema, 500: GenericSchema},
)
def create_book(request: HttpRequest, data: CreateBookSchema):
    """Create book"""
    user = request.user
    book_location = None
    if data.latitude and data.longitude:
        book_location = Point(data.longitude, data.latitude, srid=4326)
        print(book_location)

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


@book.get("/", response={200: list[PublicBookScehma]})
@paginate
def list_books(request: HttpRequest, filters: BookFilterScehma = Query(...)):  # type: ignore
    "List books based on provided filters."

    queryset = Book.objects.all()

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

    if filters.latitude and filters.longitude:
        user_location = Point(filters.longitude, filters.latitude, srid=4326)
        queryset = (
            queryset.filter(filter_conditions)
            .annotate(
                distance=Distance("location", user_location),
                owner_first_name=F("user__first_name"),
                owner_last_name=F("user__last_name"),
                owner_location=F("user__location"),
            )
            .order_by("distance")
        )

        results: list[PublicBookScehma] = []
        #   this loop is for deserializing the distance objecct to string so that it can deserialized.
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
                )
            )
        return results
    else:
        queryset = queryset.filter(filter_conditions).annotate(
            owner_first_name=F("user__first_name"),
            owner_last_name=F("user__last_name"),
            owner_location=F("user_location"),
        )

        return queryset
