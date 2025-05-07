from decimal import Decimal
from typing import Literal
from typing import Optional

from ninja import Schema
from pydantic import EmailStr

from .choices import BookCategoryChoices
from .choices import BookConditionChoices


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
    category: Literal[
        BookCategoryChoices.TEXTBOOK,
        BookCategoryChoices.SOLUTION,
        BookCategoryChoices.REFERENCE,
        BookCategoryChoices.GUIDEBOOK,
        BookCategoryChoices.OTHER,
    ]
    publication: Optional[str] = None
    edition: int = 1
    is_school_book: bool = False
    grade: Optional[int] = None
    is_college_book: bool = False
    is_bachlore_book: bool = False
    description: str
    condition: Literal[
        BookConditionChoices.LIKE_NEW,
        BookConditionChoices.GOOD,
        BookConditionChoices.MODERATE,
        BookConditionChoices.POOR,
    ]
    price: Decimal = Decimal("0.00")
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class S3UploadURLResponseScehma(Schema):
    url: str
    fields: dict[str, str]
    key: str


class S3GetSignedObjectURLScehma(Schema):
    url: str


class GenericSchema(Schema):
    detail: str
