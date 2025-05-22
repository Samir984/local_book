from django.contrib import admin
from django.contrib import messages
from django.contrib.auth.admin import UserAdmin
from django.db.models import QuerySet
from django.http import HttpRequest

from core.actions import accept_book
from core.actions import disable_book

# from .forms import CustomUserCreationForm
from .models import Book
from .models import BookMark
from .models import BookMarkItem
from .models import Report
from .models import User
from .utils import delete_image_from_s3  # Import the function


@admin.register(User)
class CustomUserAdmin(UserAdmin):

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "username",
                    "password",
                )
            },
        ),
        (
            "Personal info",
            {"fields": ("first_name", "last_name", "email", "phone_number")},
        ),
        (
            "Location",
            {"fields": ("location",)},
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )
    list_display = (
        "id",
        "username",
        "email",
        "first_name",
        "last_name",
        "phone_number",
        "is_staff",
    )
    search_fields = (
        "username",
        "email",
        "first_name",
        "last_name",
        "phone_number",
    )
    ordering = ("username",)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin[Book]):
    list_display = (
        "id",
        "name",
        "book_image",
        "is_disabled",
        "is_reviewed",
        "is_accepted",
        "is_rejected",
        "is_sold",
        "user",
        "price",
        "category",
        "publication",
        "grade",
        "is_school_book",
        "is_bachlore_book",
        "is_college_book",
        "edition",
        "condition",
        "latitude",
        "longitude",
        "date_created",
        "location",
    )
    actions = (accept_book, disable_book)
    list_filter = (
        "user",
        "is_school_book",
        "is_college_book",
        "condition",
        "is_sold",
        "is_accepted",
        "is_rejected",
        "date_created",
    )
    search_fields = (
        "name",
        "publication",
        "description",
        "user__username",
    )
    ordering = ("-date_created",)

    readonly_fields = ("date_created", "data_modified")

    def delete_model(self, request: HttpRequest, obj: Book):
        try:
            print(f"Deleting image from S3: {obj.book_image}")
            delete_image_from_s3(str(obj.book_image))
            print(f"Deleted image from S3: {obj.book_image}")
            super().delete_model(request, obj)

        except Exception as e:
            messages.error(
                request,
                "Failed to delete the image associated with book"
                f" '{obj.name}'. The book itself was not deleted. Error: {e}",
            )

    def delete_queryset(self, request: HttpRequest, queryset: QuerySet[Book]):
        try:
            for obj in queryset:
                print(f"Deleting image from S3: {obj.book_image}")
                delete_image_from_s3(str(obj.book_image))
            super().delete_queryset(request, queryset)

        except Exception as e:
            messages.error(
                request,
                "Failed to delete the images associated with books. "
                "The books themselves were not deleted. Error: {e}",
            )


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin[Report]):
    list_display = ("id", "user", "book", "reason", "date_created")
    list_filter = ("user", "book", "date_created")
    search_fields = ("user__username", "book__name", "reason")
    ordering = ("-date_created",)


@admin.register(BookMark)
class BookMarkAdmin(admin.ModelAdmin[BookMark]):
    list_display = ("id", "user", "date_created")
    list_filter = ("user", "date_created")
    search_fields = ("user__username",)


@admin.register(BookMarkItem)
class BookMarkItemAdmin(admin.ModelAdmin[BookMarkItem]):
    list_display = ("id", "bookmark", "book")
    list_filter = ("book",)
