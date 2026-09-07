from django.contrib import admin

from .models import Issue


@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "status",
        "priority",
        "reporter",
        "assignee",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "status",
        "priority",
        "created_at",
    )

    search_fields = (
        "title",
        "description",
        "reporter__username",
        "assignee__username",
    )

    ordering = ("-created_at",)

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    autocomplete_fields = (
        "reporter",
        "assignee",
    )
