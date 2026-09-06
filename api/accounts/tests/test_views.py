import pytest
from django.urls import reverse
from rest_framework import status

from accounts.tasks import send_password_reset_email


@pytest.mark.django_db
class TestAccountsViews:
    def test_user_can_login(self, api_client, user):
        response = api_client.post(
            reverse("login"),
            {
                "username": user.username,
                "password": "strong-password-123",
            },
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == user.username

    def test_invalid_password_is_rejected(self, api_client, user):
        response = api_client.post(
            reverse("login"),
            {
                "username": user.username,
                "password": "wrong-password",
            },
            format="json",
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_authenticated_user_can_get_me(self, api_client, user):
        api_client.force_authenticate(user=user)

        response = api_client.get(reverse("me"))

        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == user.username

    def test_anonymous_user_cannot_get_me(self, api_client):
        response = api_client.get(reverse("me"))

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_login_creates_session(self, api_client, user):
        response = api_client.post(
            reverse("login"),
            {
                "username": user.username,
                "password": "strong-password-123",
            },
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK

        response = api_client.get(reverse("me"))

        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == user.username

    def test_forgot_password_queues_email_task(
        self,
        api_client,
        user,
        mocker,
    ):
        mock_task = mocker.patch.object(
            send_password_reset_email,
            "delay",
        )

        response = api_client.post(
            reverse("forgot-password"),
            {
                "email": user.email,
            },
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {
            "detail": (
                "If an account exists with that email address, " "you will receive a password reset link shortly."
            )
        }

        mock_task.assert_called_once_with(user.pk)

    def test_forgot_password_does_not_reveal_unknown_email(
        self,
        api_client,
    ):
        response = api_client.post(
            reverse("forgot-password"),
            {
                "email": "unknown@example.com",
            },
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data == {
            "detail": (
                "If an account exists with that email address, " "you will receive a password reset link shortly."
            )
        }

    def test_forgot_password_is_case_insensitive(
        self,
        api_client,
        user,
        mocker,
    ):
        mock_task = mocker.patch.object(
            send_password_reset_email,
            "delay",
        )

        response = api_client.post(
            reverse("forgot-password"),
            {
                "email": user.email.upper(),
            },
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK
        mock_task.assert_called_once_with(user.pk)

    def test_forgot_password_requires_valid_email(self, api_client):
        response = api_client.post(
            reverse("forgot-password"),
            {
                "email": "not-an-email",
            },
            format="json",
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data

    def test_forgot_password_requires_email(self, api_client):
        response = api_client.post(
            reverse("forgot-password"),
            {},
            format="json",
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data
