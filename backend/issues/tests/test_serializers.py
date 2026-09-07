import pytest
from model_bakery import baker

from issues.serializers import IssueSerializer


@pytest.mark.django_db
class TestIssueSerializer:
    def test_valid_issue_data(self, user):
        project = baker.make(
            "projects.Project",
            owner=user,
        )

        serializer = IssueSerializer(
            data={
                "project": project.id,
                "title": "Login button is broken",
                "description": "The login button does nothing.",
                "status": "open",
                "priority": "high",
                "assignee": user.id,
            }
        )

        assert serializer.is_valid()
        assert serializer.validated_data["title"] == "Login button is broken"
        assert serializer.validated_data["project"] == project

    def test_blank_title_is_rejected(self, project):
        serializer = IssueSerializer(
            data={
                "project": project.id,
                "title": "   ",
            }
        )

        assert not serializer.is_valid()
        assert "title" in serializer.errors
        assert serializer.errors["title"][0] == "Title cannot be blank."

    def test_missing_title_is_rejected(self, project):
        serializer = IssueSerializer(
            data={
                "project": project.id,
            }
        )

        assert not serializer.is_valid()
        assert "title" in serializer.errors

    def test_missing_project_is_rejected(self):
        serializer = IssueSerializer(
            data={
                "title": "Test issue",
            }
        )

        assert not serializer.is_valid()
        assert "project" in serializer.errors

    def test_invalid_status_is_rejected(self, project):
        serializer = IssueSerializer(
            data={
                "project": project.id,
                "title": "Test issue",
                "status": "invalid",
            }
        )

        assert not serializer.is_valid()
        assert "status" in serializer.errors

    def test_invalid_priority_is_rejected(self, project):
        serializer = IssueSerializer(
            data={
                "project": project.id,
                "title": "Test issue",
                "priority": "invalid",
            }
        )

        assert not serializer.is_valid()
        assert "priority" in serializer.errors

    def test_null_assignee_is_allowed(self, project):
        serializer = IssueSerializer(
            data={
                "project": project.id,
                "title": "Unassigned issue",
                "assignee": None,
            }
        )

        assert serializer.is_valid()
        assert serializer.validated_data["assignee"] is None

    def test_reporter_is_read_only(self, another_user, project):
        serializer = IssueSerializer(
            data={
                "project": project.id,
                "title": "Test issue",
                "reporter": another_user.id,
            }
        )

        assert serializer.is_valid()
        assert "reporter" not in serializer.validated_data
