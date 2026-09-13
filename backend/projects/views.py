from django.contrib.auth import get_user_model
from django.db.models import Q
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.serializers import UserSerializer

from .models import Project
from .permissions import IsProjectMember, IsProjectOwner
from .serializers import ProjectSerializer

User = get_user_model()


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.action in [
            "update",
            "partial_update",
            "destroy",
            "add_member",
            "remove_member",
        ]:
            permission_classes = [
                permissions.IsAuthenticated,
                IsProjectOwner,
            ]
        else:
            permission_classes = [
                permissions.IsAuthenticated,
                IsProjectMember,
            ]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return (
            Project.objects.filter(Q(owner=self.request.user) | Q(members=self.request.user))
            .distinct()
            .select_related("owner")
            .prefetch_related("members")
            .order_by("-created_at")
        )

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=True, methods=["post"], url_path="members")
    def add_member(self, request, pk=None):
        project = self.get_object()

        user_id = request.data.get("user_id")

        if not user_id:
            return Response(
                {"detail": "user_id is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if user == project.owner:
            return Response(
                {"detail": "The project owner is already a member."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if project.members.filter(pk=user.pk).exists():
            return Response(
                {"detail": "User is already a project member."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        project.members.add(user)

        return Response(
            UserSerializer(user).data,
            status=status.HTTP_201_CREATED,
        )

    @action(
        detail=True,
        methods=["delete"],
        url_path=r"members/(?P<user_id>\d+)",
    )
    def remove_member(self, request, pk=None, user_id=None):
        project = self.get_object()

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not project.members.filter(pk=user.pk).exists():
            return Response(
                {"detail": "User is not a member of this project."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        project.members.remove(user)

        return Response(status=status.HTTP_204_NO_CONTENT)
