from ninja import Schema
from typing import Optional
from pydantic import EmailStr


class LoginSchema(Schema):
    email: EmailStr
    password: str


class UserSchema(Schema):
    username: str
    email: str
    latitude: float
    longitude: float
    phone_number: str


class RegisterSchema(Schema):
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    password: str
    latitude: float
    longitude: float
    phone_number: str


class CreateBookSchema(Schema):
    name: str
    publication: str
    edition: str
    is_academic_book: bool = False
    is_school_book: bool = False
    grade: Optional[str] = None
    is_college_book: bool = False
    stream: Optional[str] = None
    description: str
    condition: str
    price: float = 0.00


class GenericSchema(Schema):
    detail: str
