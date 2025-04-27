from django.http import HttpRequest
from django.contrib.auth import authenticate
from django.contrib.auth import login
from django.contrib.auth import logout

from core.models import User
from core.models import Book
from core.models import Report
from core.models import BookMark


from ninja import NinjaAPI
from ninja import Router
from ninja.security import SessionAuth

from core.schema import LoginSchema
from core.schema import RegisterSchema
from core.schema import CreateBookSchema, GenericSchema, UserSchema

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

session_auth = SessionAuth()

api = NinjaAPI(
    docs_url="/docs/",
    title="Book Exchange API",
    version="1.0.0",
    # auth=session_auth,
)
api.add_router("/users/", user, tags=["Users"])
api.add_router("/books/", book, tags=["books"])
api.add_router("/reports/", report, tags=["reports"])
api.add_router("/ratings/", rating, tags=["ratings"])


@user.post("/register/", response={201: GenericSchema, 400: GenericSchema})
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


@user.post("/login/", response={200: GenericSchema, 401: GenericSchema})
def login_user(request: HttpRequest, data: LoginSchema):
    try:
        user = User.objects.get(email=data.email)  # Get user by email
    except User.DoesNotExist:
        return 401, {"detail": "User not found."}

    if user.check_password(data.password):
        login(request, user)
        return 200, {"status": "success", "detail": "Login successful"}
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

