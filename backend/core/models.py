from decimal import Decimal

from django.contrib.auth.models import AbstractUser
from django.contrib.gis.db.models import PointField
from django.core.validators import MaxValueValidator
from django.core.validators import MinValueValidator
from django.db import models

from core.choices import BookCategoryChoices
from core.choices import BookConditionChoices


class User(AbstractUser):
    phone_number = models.CharField(max_length=20, default="")
    location = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username


class Book(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="books"
    )
    book_image = models.ImageField(upload_to="book/")
    name = models.CharField(max_length=100)
    category = models.CharField(
        max_length=20,
        choices=BookCategoryChoices.choices,
        default=BookCategoryChoices.OTHER,
    )
    publication = models.CharField(
        max_length=255, null=True, blank=True, default=None
    )
    edition = models.IntegerField(
        validators=[MinValueValidator(1)],
        default=1,
    )
    is_school_book = models.BooleanField(default=False)
    grade = models.PositiveIntegerField(
        validators=[MaxValueValidator(10)], blank=True, null=True
    )
    is_college_book = models.BooleanField(default=False)
    is_bachlore_book = models.BooleanField(default=False)

    description = models.TextField(help_text="Details of the book.")
    condition = models.CharField(
        choices=BookConditionChoices.choices, max_length=10
    )
    price = models.DecimalField(
        max_digits=6, decimal_places=2, default=Decimal("0.00")
    )

    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        blank=True,
        null=True,
    )

    is_sold = models.BooleanField(default=False)
    is_reviewed = models.BooleanField(default=False)
    is_accepted = models.BooleanField(default=False)
    is_rejected = models.BooleanField(default=False)

    date_created = models.DateTimeField(auto_now_add=True)
    data_modified = models.DateTimeField(auto_now=True)

    latitude = models.FloatField(null=True, blank=True, default=None)
    longitude = models.FloatField(null=True, blank=True, default=None)
    location = PointField(null=True, blank=True, srid=4326)

    class Meta:
        indexes = [
            models.Index(fields=["name"]),
        ]

    def __str__(self):
        return f"{self.name} - {self.user.username}"


class Report(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="reports"
    )
    book = models.ForeignKey(
        Book, on_delete=models.CASCADE, related_name="reports"
    )

    reason = models.TextField(help_text="Details of the report.")
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Report by {self.user.username} for {self.book.name}"


class BookMark(models.Model):
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="bookmarks"
    )
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} bookmarked"


class BookMarkItem(models.Model):
    bookmark = models.ForeignKey(
        BookMark, on_delete=models.CASCADE, related_name="bookmark_items"
    )
    book = models.ForeignKey(
        Book, on_delete=models.CASCADE, related_name="bookmark_items"
    )

    def __str__(self):
        return f"{self.bookmark.user.username} bookmarked {self.book.name}"
