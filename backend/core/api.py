import os
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout
from django.db import IntegrityError
from django.http import HttpRequest
from ninja import NinjaAPI
from ninja import Router
from ninja.security import SessionAuth
from datetime import datetime

from core.models import Book
from core.models import BookMark
from core.models import Report
from core.models import User
from core.schema import CreateBookSchema
from core.schema import GenericSchema
from core.schema import LoginSchema
from core.schema import RegisterSchema
from core.schema import UserSchema
from core.schema import S3UploadURLResponseScehma

# from core.schema import BookSchema
# from core.schema import BookListSchema
# from core.schema import BookDetailSchema
# from core.schema import ReportSchema
# from core.schema import ReportListSchema
# from core.schema import RatingSchema
# from core.schema import RatingListSchema

from core.utils import s3_client
from core.utils import BUCKET_NAME
from core.utils import MAX_UPLOAD_SIZE
from core.utils import ALLOWED_EXTENSIONS
from core.utils import MIME_TYPES


from botocore.exceptions import ClientError

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
    auth=None,
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
            ExpiresIn=3600,
        )
        return {
            "url": response["url"],
            "fields": response["fields"],
            "key": object_name,
        }
    except ClientError as e:
        return 500, {"detail": str(e)}


@s3.post("/delete-file")
def delete_file(request: HttpRequest, key: str):
    """Deletes a file from S3 based on its key."""
    try:
        s3_client.delete_object(Bucket=BUCKET_NAME, Key=key)
        return {"detail": "File deleted successfully"}
    except ClientError as e:
        return 500, {"detail": str(e)}


@book.post(
    "/create/",
    response={201: GenericSchema, 400: GenericSchema, 500: GenericSchema},
)
def create_book(request: HttpRequest, data: CreateBookSchema):
    user = request.user

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
        )

        return 201, {
            "detail": "Book created successfully.",
        }

    except IntegrityError as e:
        return 400, {
            "detail": (
                f"Database Integrity Error: {e}.  Check for missing or invalid"
                " data."
            ),
        }

    except Exception as e:
        return 500, {
            "detail": "Failed to create book due to an unexpected error."
        }
