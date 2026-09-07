import pytest
from model_bakery import baker
from rest_framework.test import APIClient

from issues.models import Issue


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user():
    return baker.make(
        "accounts.User",
        username="testuser",
        email="test@example.com",
    )


@pytest.fixture
def another_user():
    return baker.make(
        "accounts.User",
        username="anotheruser",
        email="another@example.com",
    )


@pytest.fixture
def authenticated_client(user):
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.fixture
def issue(user):
    return baker.make(
        Issue,
        reporter=user,
    )
