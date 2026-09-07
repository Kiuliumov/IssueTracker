from rest_framework import permissions


class IsProjectOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user


class IsProjectMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user or obj.members.filter(pk=request.user.pk).exists()
