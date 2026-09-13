# Create your models here.
import uuid
from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone


class Joinvite(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        ACCEPTED = "accepted", "Accepted"
        EXPIRED = "expired", "Expired"
        REVOKED = "revoked", "Revoked"

    project = models.ForeignKey(
        "projects.Project",
        on_delete=models.CASCADE,
        related_name="joinvites",
    )
    email = models.EmailField()
    invited_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="sent_joinvites",
    )
    token = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    expires_at = models.DateTimeField()
    accepted_at = models.DateTimeField(
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.email} → {self.project.name}"

    @property
    def is_expired(self):
        return timezone.now() >= self.expires_at

    def mark_expired(self):
        if self.status == self.Status.PENDING and self.is_expired:
            self.status = self.Status.EXPIRED
            self.save(update_fields=["status"])
