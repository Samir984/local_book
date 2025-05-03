from django.db.models import TextChoices


class BookConditionChoices(TextChoices):
    LIKE_NEW = ("LIKE NEW", "Like New")
    GOOD = ("GDOD", "Good")
    MODERATE = ("MODERATE", "Moderate")
    POOR = ("POOR", "Poor")


class EditionChoices(TextChoices):
    FIRST = ("FIRST", "First Edition")
    SECOND = ("SECOND", "Second Edition")
    THIRD = ("THIRD", "Third Edition")
    FOURTH = ("FOURTH", "Fourth Edition")
    FIFTH = ("FIFTH", "Fifth Edition")


class GradeChoices(TextChoices):
    FIRST = ("FIRST", "First")
    SECOND = ("SECOND", "Second")
    THIRD = ("THIRD", "Third")
    FOURTH = ("FOURTH", "Fourth")
    FIFTH = ("FIFTH", "Fifth")
    SIXTH = ("SIXTH", "Sixth")
    SEVENTH = ("SEVENTH", "Seventh")
    EIGHTH = ("EIGHTH", "Eighth")
    NINTH = ("NINTH", "Ninth")
    TENTH = ("TENTH", "Tenth")


class BookCategoryChoices(TextChoices):
    TEXTBOOK = ("TEXTBOOK", "Text Book")
    REFERENCE = ("REFERENCE", "Reference Book")
    GUIDEBOOK = ("GUIDEBOOK", "Guide Book")
    SOLUTION = ("SOLUTION", "Solution")
    OTHER = ("OTHER", "Other")
