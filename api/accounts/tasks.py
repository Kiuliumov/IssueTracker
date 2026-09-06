from celery import shared_task
from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail

User = get_user_model()


@shared_task
def send_password_reset_email(user_id):
    user = User.objects.get(pk=user_id)

    token = default_token_generator.make_token(user)

    reset_url = f"{settings.FRONTEND_URL}" f"/reset-password/{user.pk}/{token}/"

    send_mail(
        subject="Reset your IssueTracker password",
        message=(
            "You requested a password reset for your IssueTracker account.\n\n"
            f"Reset your password here:\n{reset_url}\n\n"
            "If you did not request this, you can safely ignore this email."
        ),
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
    )
