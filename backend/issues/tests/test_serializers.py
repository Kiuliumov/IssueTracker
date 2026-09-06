import pytest

from issues.serializers import IssueSerializer


class TestIssueSerializer:
    @pytest.mark.django_db
    def test_valid_issue_data(self, user):
        serializer = IssueSerializer(
            data={
                "title": "Login button is broken",
                "description": "The login button does nothing.",
                "status": "open",
                "priority": "high",
                "assignee": user.id,
            }
        )

        assert serializer.is_valid()
        assert serializer.validated_data["title"] == "Login button is broken"

    @pytest.mark.django_db
    def test_blank_title_is_rejected(self):
        serializer = IssueSerializer(
            data={
                "title": "   ",
            }
        )

        assert not serializer.is_valid()
        assert "title" in serializer.errors
        assert serializer.errors["title"][0] == "This field may not be blank."

    @pytest.mark.django_db
    def test_missing_title_is_rejected(self):
        serializer = IssueSerializer(data={})

        assert not serializer.is_valid()
        assert "title" in serializer.errors

    @pytest.mark.django_db
    def test_invalid_status_is_rejected(self):
        serializer = IssueSerializer(
            data={
                "title": "Test issue",
                "status": "invalid",
            }
        )

        assert not serializer.is_valid()
        assert "status" in serializer.errors

    @pytest.mark.django_db
    def test_invalid_priority_is_rejected(self):
        serializer = IssueSerializer(
            data={
                "title": "Test issue",
                "priority": "invalid",
            }
        )

        assert not serializer.is_valid()
        assert "priority" in serializer.errors

    @pytest.mark.django_db
    def test_null_assignee_is_allowed(self):
        serializer = IssueSerializer(
            data={
                "title": "Unassigned issue",
                "assignee": None,
            }
        )

        assert serializer.is_valid()
        assert serializer.validated_data["assignee"] is None

    @pytest.mark.django_db
    def test_reporter_is_read_only(self, another_user):
        serializer = IssueSerializer(
            data={
                "title": "Test issue",
                "reporter": another_user.id,
            }
        )

        assert serializer.is_valid()
        assert "reporter" not in serializer.validated_data
