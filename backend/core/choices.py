from django.db.models import TextChoices


class BookConditionChoices(TextChoices):
    LIKE_NEW = ("LN", "Like New")
    GOOD = ("GD", "Good")
    MODERATE = ("MOD", "Moderate")
    POOR = ("PR", "Poor")


class EditionChoices(TextChoices):
    FIRST = ("FIRST", "First Edition")
    SECOND = ("SECOND", "Second Edition")
    THIRD = ("THIRD", "Third Edition")
    FOURTH = ("FOURTH", "Fourth Edition")
    FIFTH = ("FIFTH", "Fifth Edition")


class StreamChoices(TextChoices):
    SCIENCE = ("SCIENCE", "Science")
    MANAGEMENT = ("MANAGEMENT", "Management")
    COMMERCE = ("COMMERCE", "Commerce")
    ART = ("ART", "Art")


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
    ELEVENTH = ("ELEVENTH", "Eleventh")
    TWELFTH = ("TWELFTH", "Twelfth")
