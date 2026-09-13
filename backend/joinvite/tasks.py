from datetime import timedelta

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from .models import Joinvite


@shared_task
def send_joinvite_email(joinvite_id):
    try:
        joinvite = Joinvite.objects.select_related(
            "project",
            "invited_by",
        ).get(pk=joinvite_id)
    except Joinvite.DoesNotExist:
        return

    if joinvite.status != Joinvite.Status.PENDING:
        return

    if joinvite.is_expired:
        joinvite.status = Joinvite.Status.EXPIRED
        joinvite.save(update_fields=["status"])
        return

    accept_url = f"{settings.FRONTEND_URL}/joinvite/" f"{joinvite.token}"

    send_mail(
        subject=f"You're invited to join {joinvite.project.name}",
        message=(
            f"{joinvite.invited_by.username} invited you to join "
            f"{joinvite.project.name}.\n\n"
            f"Accept the invitation here:\n"
            f"{accept_url}\n\n"
            f"This invitation expires on "
            f"{joinvite.expires_at:%Y-%m-%d %H:%M UTC}."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[joinvite.email],
        fail_silently=False,
    )
