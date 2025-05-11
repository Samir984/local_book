from decimal import Decimal
from typing import Literal
from typing import Optional

from ninja import Field
from ninja import FilterSchema
from ninja import Schema
from ninja.orm import ModelSchema
from pydantic import EmailStr

from core.models import Book

from .choices import BookCategoryChoices
from .choices import BookConditionChoices


class LoginSchema(Schema):
    email: EmailStr
    password: str


class UserSchema(Schema):
    first_name: str
    last_name: str
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


class PublicBookScehma(ModelSchema):
    distance: Optional[str] = None
    owner_first_name: str = ""
    owner_last_name: str = ""
    owner_location: str = ""

    class Meta:
        model = Book
        fields = [
            "id",
            "name",
            "book_image",
            "condition",
            "price",
            "category",
            "is_school_book",
            "is_college_book",
            "is_bachlore_book",
            "grade",
        ]


class BookDetailSchema(ModelSchema):
    user: UserSchema

    class Meta:
        model = Book
        fields = [
            "id",
            "name",
            "book_image",
            "latitude",
            "longitude",
            "description",
            "condition",
            "price",
            "category",
            "is_school_book",
            "is_college_book",
            "is_bachlore_book",
            "grade",
            "date_created",
        ]


class PrivateBookScehma(ModelSchema):
    class Meta:
        model = Book
        fields = [
            "name",
            "book_image",
            "condition",
            "price",
            "category",
            "is_reviewed",
            "is_accepted",
            "is_rejected",
            "is_sold",
        ]


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
    edition: int = Field(1, ge=0)
    is_school_book: bool = False
    grade: Optional[int] = Field(None, ge=0, le=11)

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


class BookFilterScehma(FilterSchema):
    name: Optional[str] = None
    publication: Optional[str] = None
    category: Optional[
        Literal[
            BookCategoryChoices.TEXTBOOK,
            BookCategoryChoices.SOLUTION,
            BookCategoryChoices.REFERENCE,
            BookCategoryChoices.GUIDEBOOK,
            BookCategoryChoices.OTHER,
        ]
    ] = None
    condition: Optional[
        Literal[
            BookConditionChoices.LIKE_NEW,
            BookConditionChoices.GOOD,
            BookConditionChoices.MODERATE,
            BookConditionChoices.POOR,
        ]
    ] = None
    is_school_book: Optional[bool] = None
    is_college_book: Optional[bool] = None
    is_bachlore_book: Optional[bool] = None
    grade: Optional[int] = Field(None, gt=0, lt=11)
    edition: Optional[int] = Field(1, gt=0)
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
