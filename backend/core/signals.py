from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import BookMark

User = get_user_model()


@receiver(post_save, sender=User)
def create_user_bookmark(sender, instance, created: bool, **kwargs):
    """
    Signal to create a BookMark instance on post_save of User.
    """
    if created:
        BookMark.objects.create(user=instance)
