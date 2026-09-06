from rest_framework import serializers

from .models import Issue


class IssueSerializer(serializers.ModelSerializer):
    reporter = serializers.ReadOnlyField(source="reporter.id")

    class Meta:
        model = Issue
        fields = [
            "id",
            "title",
            "description",
            "status",
            "priority",
            "reporter",
            "assignee",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "reporter",
            "created_at",
            "updated_at",
        ]

    def validate_title(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Title cannot be blank.")

        return value
