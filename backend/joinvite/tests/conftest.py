import pytest
from model_bakery import baker
from rest_framework.test import APIClient

from projects.models import Project


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def owner():
    return baker.make(
        "accounts.User",
        username="owner",
        email="owner@example.com",
    )


@pytest.fixture
def invited_user():
    return baker.make(
        "accounts.User",
        username="invited",
        email="invited@example.com",
    )


@pytest.fixture
def another_user():
    return baker.make(
        "accounts.User",
        username="another",
        email="another@example.com",
    )


@pytest.fixture
def project(owner):
    return baker.make(
        Project,
        name="Test Project",
        owner=owner,
    )


@pytest.fixture
def authenticated_owner_client(owner):
    client = APIClient()
    client.force_authenticate(user=owner)
    return client


@pytest.fixture
def authenticated_user_client(invited_user):
    client = APIClient()
    client.force_authenticate(user=invited_user)
    return client
