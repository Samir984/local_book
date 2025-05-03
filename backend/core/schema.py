from typing import Optional

from ninja import Schema
from pydantic import EmailStr


class LoginSchema(Schema):
    email: EmailStr
    password: str


class UserSchema(Schema):
    username: str
    email: str
    location: str
    phone_number: str


class RegisterSchema(Schema):
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    password: str
    location: str
    phone_number: str


class CreateBookSchema(Schema):
    name: str
    book_image: str
    category: str
    publication: Optional[str] = None
    edition: Optional[str] = None
    is_school_book: bool = False
    grade: Optional[str] = None
    is_college_book: bool = False
    is_bachlore_book:bool=False
    description: str
    condition: str
    price: float = 0.00
    latitude: Optional[float]=None
    longitude: Optional[float]=None


# class CreateBookSchema(Schema):
#     class Meta:
#         model = Book
#         fields = "__all__"


class S3UploadURLResponseScehma(Schema):
    url: str
    fields: dict[str, str]
    key: str


class GenericSchema(Schema):
    detail: str
