from django.db.models import Q
from rest_framework import permissions, viewsets

from .models import Project
from .permissions import IsProjectMember, IsProjectOwner
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
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
