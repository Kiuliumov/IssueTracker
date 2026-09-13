from django.contrib import admin

from .models import Joinvite


@admin.register(Joinvite)
class JoinviteAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "project",
        "email",
        "invited_by",
        "status",
        "expires_at",
        "created_at",
        "accepted_at",
    )
    list_filter = (
        "status",
        "created_at",
        "expires_at",
    )
    search_fields = (
        "email",
        "project__name",
        "invited_by__username",
    )
    readonly_fields = (
        "token",
        "created_at",
        "accepted_at",
    )
    autocomplete_fields = (
        "project",
        "invited_by",
    )
    ordering = ("-created_at",)
