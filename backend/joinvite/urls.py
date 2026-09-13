from django.urls import path

from .views import AcceptJoinviteView, CreateJoinviteView, RevokeJoinviteView

urlpatterns = [
    path(
        "projects/<int:project_id>/joinvite/",
        CreateJoinviteView.as_view(),
        name="create-joinvite",
    ),
    path(
        "joinvite/<uuid:token>/accept/",
        AcceptJoinviteView.as_view(),
        name="accept-joinvite",
    ),
    path(
        "joinvite/<int:joinvite_id>/",
        RevokeJoinviteView.as_view(),
        name="revoke-joinvite",
    ),
]