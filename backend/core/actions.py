from django.contrib import messages
from django.contrib.admin import ModelAdmin
from django.db.models.query import QuerySet
from django.http import HttpRequest

from core.models import Book


def accept_book(
    modeladmin: ModelAdmin[Book],
    request: HttpRequest,
    queryset: QuerySet[Book],
):
    count = queryset.count()
    if count > 10:
        return messages.error(request, "Select atmost 10 books.")

    for book in queryset:
        if book.is_reviewed or book.is_rejected or book.is_accepted:
            return messages.error(
                request,
                f"Action Failed. Book id {book.pk} is already reviewed.",
            )
        else:
            book.is_reviewed = True
            book.is_accepted = True
            book.save(update_fields=["is_reviewed", "is_accepted"])
            return messages.success(
                request,
                f"{count} books are reviewed as accepted.",
            )


def disable_book(
    modeladmin: ModelAdmin[Book],
    request: HttpRequest,
    queryset: QuerySet[Book],
):
    count = queryset.count()
    if count > 1:
        return messages.error(request, "Select only one books.")

    book = queryset[0]
    if book.is_sold or book.is_disabled or not book.is_reviewed:
        return messages.error(
            request, "Can't disable  sold or already disable book."
        )
    book.is_disabled = True
    book.save(update_fields=["is_disabled"])
    return messages.success(
        request,
        f"Book id {book.pk} is disabled.",
    )
