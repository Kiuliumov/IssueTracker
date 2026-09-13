from datetime import timedelta

import pytest
from django.utils import timezone
from model_bakery import baker

from joinvite.models import Joinvite


@pytest.mark.django_db
class TestJoinvite:
    def test_joinvite_is_pending_by_default(
        self,
        project,
        owner,
    ):
        joinvite = baker.make(
            Joinvite,
            project=project,
            invited_by=owner,
            email="user@example.com",
            expires_at=timezone.now() + timedelta(days=7),
        )

        assert joinvite.status == Joinvite.Status.PENDING

    def test_joinvite_token_is_unique(
        self,
        project,
        owner,
    ):
        first = baker.make(
            Joinvite,
            project=project,
            invited_by=owner,
            email="first@example.com",
            expires_at=timezone.now() + timedelta(days=7),
        )

        second = baker.make(
            Joinvite,
            project=project,
            invited_by=owner,
            email="second@example.com",
            expires_at=timezone.now() + timedelta(days=7),
        )

        assert first.token != second.token

    def test_expired_joinvite_is_expired(
        self,
        project,
        owner,
    ):
        joinvite = baker.make(
            Joinvite,
            project=project,
            invited_by=owner,
            email="user@example.com",
            expires_at=timezone.now() - timedelta(days=1),
        )

        assert joinvite.is_expired is True

    def test_mark_expired_updates_status(
        self,
        project,
        owner,
    ):
        joinvite = baker.make(
            Joinvite,
            project=project,
            invited_by=owner,
            email="user@example.com",
            expires_at=timezone.now() - timedelta(days=1),
        )

        joinvite.mark_expired()
        joinvite.refresh_from_db()

        assert joinvite.status == Joinvite.Status.EXPIRED
