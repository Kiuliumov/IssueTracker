import pytest
from django.urls import reverse


@pytest.mark.django_db
def test_user_can_login(api_client, user):
    response = api_client.post(
        reverse("login"),
        {
            "username": user.username,
            "password": "strong-password-123",
        },
        format="json",
    )

    assert response.status_code == 200
    assert response.data["username"] == user.username


@pytest.mark.django_db
def test_invalid_password_is_rejected(api_client, user):
    response = api_client.post(
        reverse("login"),
        {
            "username": user.username,
            "password": "wrong-password",
        },
        format="json",
    )

    assert response.status_code == 400


@pytest.mark.django_db
def test_authenticated_user_can_get_me(api_client, user):
    api_client.force_authenticate(user=user)

    response = api_client.get(reverse("me"))

    assert response.status_code == 200
    assert response.data["username"] == user.username


@pytest.mark.django_db
def test_anonymous_user_cannot_get_me(api_client):
    response = api_client.get(reverse("me"))

    assert response.status_code == 403


@pytest.mark.django_db
def test_login_creates_session(api_client, user):
    response = api_client.post(
        reverse("login"),
        {
            "username": user.username,
            "password": "strong-password-123",
        },
        format="json",
    )

    assert response.status_code == 200

    response = api_client.get(reverse("me"))

    assert response.status_code == 200
    assert response.data["username"] == user.username
