from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Book
from .models import BookMark
from .models import Report
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (
            "Personal info",
            {"fields": ("first_name", "last_name", "email", "phone_number")},
        ),
        (
            "Location",
            {"fields": ("country", "latitude", "longitude")},
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
        "name",
        "user",
        "publication",
        "book_image",
        "edition",
        "condition",
        "price",
        "is_sold",
        "is_accepted",
        "is_rejected",
        "date_created",
    )
    list_filter = (
        "user",
        "is_academic_book",
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

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "user",
                    "name",
                    "book_image",
                    "publication",
                    "description",
                )
            },
        ),
        (
            "Book Details",
            {
                "fields": (
                    "edition",
                    "condition",
                    "price",
                    "is_academic_book",
                    "is_school_book",
                    "grade",
                    "is_college_book",
                    "stream",
                )
            },
        ),
        (
            "Status",
            {"fields": ("is_sold", "is_accepted", "is_rejected", "rating")},
        ),
        ("Dates", {"fields": ("date_created", "data_modified")}),
    )


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin[Report]):
    list_display = ("user", "book", "reason", "date_created")
    list_filter = ("user", "book", "date_created")
    search_fields = ("user__username", "book__name", "reason")
    ordering = ("-date_created",)
    readonly_fields = ("date_created",)


@admin.register(BookMark)
class BookMarkAdmin(admin.ModelAdmin[BookMark]):
    list_display = ("user", "book", "date_created")
    list_filter = ("user", "book", "date_created")
    search_fields = ("user__username", "book__name")
    ordering = ("-date_created",)
    readonly_fields = ("date_created",)
