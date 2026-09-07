from rest_framework import serializers

from .models import Project


class ProjectSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.id")

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "owner",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "owner",
            "created_at",
            "updated_at",
        ]

    def validate_name(self, value):
        value = value.strip()

        if not value:
            raise serializers.ValidationError("Name cannot be blank.")

        return value
