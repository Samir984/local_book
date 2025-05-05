from django.db.models import TextChoices


class BookConditionChoices(TextChoices):
    LIKE_NEW = ("LIKE NEW", "Like New")
    GOOD = ("GOOD", "Good")
    MODERATE = ("MODERATE", "Moderate")
    POOR = ("POOR", "Poor")


class BookCategoryChoices(TextChoices):
    TEXTBOOK = ("TEXTBOOK", "Text Book")
    REFERENCE = ("REFERENCE", "Reference Book")
    GUIDEBOOK = ("GUIDEBOOK", "Guide Book")
    SOLUTION = ("SOLUTION", "Solution")
    OTHER = ("OTHER", "Other")
