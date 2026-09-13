from datetime import timedelta
from unittest.mock import patch

import pytest
from django.utils import timezone
from model_bakery import baker

from joinvite.models import Joinvite


@pytest.mark.django_db
class TestCreateJoinviteView:
    @patch("joinvite.views.send_joinvite_email.delay")
    def test_owner_can_create_joinvite(
        self,
        mock_send_email,
        authenticated_owner_client,
        project,
        invited_user,
    ):
        response = authenticated_owner_client.post(
            f"/api/projects/{project.id}/joinvite/",
            {
                "email": invited_user.email,
            },
            format="json",
        )

        assert response.status_code == 201

        joinvite = Joinvite.objects.get(
            project=project,
            email=invited_user.email,
        )

        assert joinvite.invited_by == project.owner
        assert joinvite.status == Joinvite.Status.PENDING
        assert joinvite.token is not None

        mock_send_email.assert_called_once_with(
            joinvite.id,
        )

    def test_non_owner_cannot_create_joinvite(
        self,
        authenticated_user_client,
        project,
        invited_user,
    ):
        response = authenticated_user_client.post(
            f"/api/projects/{project.id}/joinvite/",
            {
                "email": invited_user.email,
            },
            format="json",
        )

        assert response.status_code == 403

    def test_anonymous_user_cannot_create_joinvite(
        self,
        api_client,
        project,
        invited_user,
    ):
        response = api_client.post(
            f"/api/projects/{project.id}/joinvite/",
            {
                "email": invited_user.email,
            },
            format="json",
        )

        assert response.status_code == 403

    def test_cannot_invite_self(
        self,
        authenticated_owner_client,
        project,
    ):
        response = authenticated_owner_client.post(
            f"/api/projects/{project.id}/joinvite/",
            {
                "email": project.owner.email,
            },
            format="json",
        )

        assert response.status_code == 400
        assert "email" in response.data

    def test_cannot_invite_existing_member(
        self,
        authenticated_owner_client,
        project,
        invited_user,
    ):
        project.members.add(invited_user)

        response = authenticated_owner_client.post(
            f"/api/projects/{project.id}/joinvite/",
            {
                "email": invited_user.email,
            },
            format="json",
        )

        assert response.status_code == 400
        assert "email" in response.data

    @patch("joinvite.views.send_joinvite_email.delay")
    def test_cannot_create_duplicate_pending_joinvite(
        self,
        mock_send_email,
        authenticated_owner_client,
        project,
        invited_user,
    ):
        baker.make(
            Joinvite,
            project=project,
            invited_by=project.owner,
            email=invited_user.email,
            expires_at=timezone.now() + timedelta(days=7),
        )

        response = authenticated_owner_client.post(
            f"/api/projects/{project.id}/joinvite/",
            {
                "email": invited_user.email,
            },
            format="json",
        )

        assert response.status_code == 400
        assert "email" in response.data
        mock_send_email.assert_not_called()


@pytest.mark.django_db
class TestAcceptJoinviteView:
    def test_invited_user_can_accept_joinvite(
        self,
        authenticated_user_client,
        project,
        invited_user,
        owner,
    ):
        joinvite = baker.make(
            Joinvite,
            project=project,
            invited_by=owner,
            email=invited_user.email,
            expires_at=timezone.now() + timedelta(days=7),
        )

        response = authenticated_user_client.post(
            f"/api/joinvite/{joinvite.token}/accept/",
        )

        assert response.status_code == 200

        project.refresh_from_db()
        joinvite.refresh_from_db()

        assert project.members.filter(
            pk=invited_user.pk,
        ).exists()

        assert joinvite.status == Joinvite.Status.ACCEPTED
        assert joinvite.accepted_at is not None

    def test_wrong_user_cannot_accept_joinvite(
        self,
        api_client,
        project,
        invited_user,
        another_user,
        owner,
    ):
        api_client.force_authenticate(user=another_user)

        joinvite = baker.make(
            Joinvite,
            project=project,
            invited_by=owner,
            email=invited_user.email,
            expires_at=timezone.now() + timedelta(days=7),
        )

        response = api_client.post(
            f"/api/joinvite/{joinvite.token}/accept/",
        )

        assert response.status_code == 403

        project.refresh_from_db()

        assert not project.members.filter(
            pk=another_user.pk,
        ).exists()

    def test_expired_joinvite_cannot_be_accepted(
        self,
        authenticated_user_client,
        project,
        invited_user,
        owner,
    ):
        joinvite = baker.make(
            Joinvite,
            project=project,
            invited_by=owner,
            email=invited_user.email,
            expires_at=timezone.now() - timedelta(days=1),
        )

        response = authenticated_user_client.post(
            f"/api/joinvite/{joinvite.token}/accept/",
        )

        assert response.status_code == 400

        joinvite.refresh_from_db()

        assert joinvite.status == Joinvite.Status.EXPIRED

    def test_revoked_joinvite_cannot_be_accepted(
        self,
        authenticated_user_client,
        project,
        invited_user,
        owner,
    ):
        joinvite = baker.make(
            Joinvite,
            project=project,
            invited_by=owner,
            email=invited_user.email,
            status=Joinvite.Status.REVOKED,
            expires_at=timezone.now() + timedelta(days=7),
        )

        response = authenticated_user_client.post(
            f"/api/joinvite/{joinvite.token}/accept/",
        )

        assert response.status_code == 400

    def test_anonymous_user_cannot_accept_joinvite(
        self,
        api_client,
        project,
        invited_user,
        owner,
    ):
        joinvite = baker.make(
            Joinvite,
            project=project,
            invited_by=owner,
            email=invited_user.email,
            expires_at=timezone.now() + timedelta(days=7),
        )

        response = api_client.post(
            f"/api/joinvite/{joinvite.token}/accept/",
        )

        assert response.status_code == 403


@pytest.mark.django_db
class TestRevokeJoinviteView:
    def test_owner_can_revoke_joinvite(
        self,
        authenticated_owner_client,
        project,
        invited_user,
        owner,
    ):
        joinvite = baker.make(
            Joinvite,
            project=project,
            invited_by=owner,
            email=invited_user.email,
            expires_at=timezone.now() + timedelta(days=7),
        )

        response = authenticated_owner_client.delete(
            f"/api/joinvite/{joinvite.id}/",
        )

        assert response.status_code == 204

        joinvite.refresh_from_db()

        assert joinvite.status == Joinvite.Status.REVOKED

    def test_non_owner_cannot_revoke_joinvite(
        self,
        authenticated_user_client,
        project,
        invited_user,
        owner,
    ):
        joinvite = baker.make(
            Joinvite,
            project=project,
            invited_by=owner,
            email=invited_user.email,
            expires_at=timezone.now() + timedelta(days=7),
        )

        response = authenticated_user_client.delete(
            f"/api/joinvite/{joinvite.id}/",
        )

        assert response.status_code == 403
