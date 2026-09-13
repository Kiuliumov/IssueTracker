from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Joinvite

User = get_user_model()


class CreateJoinviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Joinvite
        fields = ["email"]

    def validate_email(self, value):
        return value.strip().lower()

    def validate(self, attrs):
        request = self.context["request"]
        project = self.context["project"]

        email = attrs["email"]

        if email == request.user.email.lower():
            raise serializers.ValidationError({"email": "You cannot invite yourself."})

        user = User.objects.filter(
            email__iexact=email,
        ).first()

        if user and (user == project.owner or project.members.filter(pk=user.pk).exists()):
            raise serializers.ValidationError({"email": "This user is already a member of the project."})

        existing_invite = Joinvite.objects.filter(
            project=project,
            email__iexact=email,
            status=Joinvite.Status.PENDING,
        ).first()

        if existing_invite:
            if existing_invite.is_expired:
                existing_invite.mark_expired()
            else:
                raise serializers.ValidationError({"email": "There is already a pending invitation for this email."})

        return attrs


class JoinviteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Joinvite
        fields = [
            "id",
            "project",
            "email",
            "invited_by",
            "status",
            "expires_at",
            "accepted_at",
            "created_at",
        ]
        read_only_fields = fields
