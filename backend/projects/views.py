from rest_framework import permissions, viewsets

from .models import Project
from .permissions import IsProjectOwner
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = [
        permissions.IsAuthenticated,
        IsProjectOwner,
    ]
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(owner=self.request.user).select_related("owner").order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
