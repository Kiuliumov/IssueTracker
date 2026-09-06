import pytest
from model_bakery import baker
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    user = baker.make(
        "accounts.User",
        username="john",
        email="john@example.com",
    )
    user.set_password("strong-password-123")
    user.save()

    return user
