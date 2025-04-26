from django.http import HttpRequest
from ninja import NinjaAPI
from ninja import Router
from ninja.security import SessionAuth

user = Router()
book = Router()
report = Router()
rating = Router()

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


@api.get("/ping")
def ping(request: HttpRequest):
    return {"ping": "pong"}
