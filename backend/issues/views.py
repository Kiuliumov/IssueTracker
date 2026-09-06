from django.shortcuts import render
# Create your views here.
from rest_framework import permissions, viewsets

from .models import Issue
from .serializers import IssueSerializer


class IssueViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = IssueSerializer

    def get_queryset(self):
        return Issue.objects.select_related(
            "reporter",
            "assignee",
        ).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)
