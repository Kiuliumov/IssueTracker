# Create your views here.
from datetime import timedelta

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from rest_framework.views import APIView

from projects.models import Project

from .models import Joinvite
from .serializers import CreateJoinviteSerializer, JoinviteSerializer
from .tasks import send_joinvite_email

User = get_user_model()


class CreateJoinviteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, project_id):
        project = get_object_or_404(
            Project,
            pk=project_id,
        )

        if project.owner != request.user:
            raise PermissionDenied("Only the project owner can invite members.")

        serializer = CreateJoinviteSerializer(
            data=request.data,
            context={
                "request": request,
                "project": project,
            },
        )
        serializer.is_valid(raise_exception=True)

        joinvite = serializer.save(
            project=project,
            invited_by=request.user,
            expires_at=timezone.now() + timedelta(days=7),
        )

        send_joinvite_email.delay(joinvite.pk)

        return Response(
            JoinviteSerializer(joinvite).data,
            status=status.HTTP_201_CREATED,
        )


class AcceptJoinviteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, token):
        joinvite = get_object_or_404(
            Joinvite.objects.select_related("project"),
            token=token,
        )

        if joinvite.status == Joinvite.Status.ACCEPTED:
            return Response(
                {"detail": "This invitation has already been accepted."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if joinvite.status == Joinvite.Status.REVOKED:
            return Response(
                {"detail": "This invitation has been revoked."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if joinvite.is_expired:
            joinvite.status = Joinvite.Status.EXPIRED
            joinvite.save(update_fields=["status"])

            return Response(
                {"detail": "This invitation has expired."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if request.user.email.lower() != joinvite.email.lower():
            raise PermissionDenied("This invitation was sent to a different email address.")

        project = joinvite.project

        if request.user == project.owner:
            return Response(
                {"detail": "You are already the project owner."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if project.members.filter(pk=request.user.pk).exists():
            joinvite.status = Joinvite.Status.ACCEPTED
            joinvite.accepted_at = timezone.now()
            joinvite.save(
                update_fields=[
                    "status",
                    "accepted_at",
                ]
            )

            return Response(
                {"detail": "You are already a member of this project."},
                status=status.HTTP_200_OK,
            )

        project.members.add(request.user)

        joinvite.status = Joinvite.Status.ACCEPTED
        joinvite.accepted_at = timezone.now()
        joinvite.save(
            update_fields=[
                "status",
                "accepted_at",
            ]
        )

        return Response(
            {
                "detail": "You have joined the project.",
                "project": project.id,
            },
            status=status.HTTP_200_OK,
        )


class RevokeJoinviteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, joinvite_id):
        joinvite = get_object_or_404(
            Joinvite.objects.select_related("project"),
            pk=joinvite_id,
        )

        if joinvite.project.owner != request.user:
            raise PermissionDenied("Only the project owner can revoke invitations.")

        if joinvite.status != Joinvite.Status.PENDING:
            return Response(
                {"detail": "Only pending invitations can be revoked."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        joinvite.status = Joinvite.Status.REVOKED
        joinvite.save(update_fields=["status"])

        return Response(
            status=status.HTTP_204_NO_CONTENT,
        )
