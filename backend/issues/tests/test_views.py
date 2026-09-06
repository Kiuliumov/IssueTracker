import pytest
from model_bakery import baker

from issues.models import Issue


class TestIssueViewSet:
    @pytest.mark.django_db
    def test_anonymous_user_cannot_list_issues(self, api_client):
        response = api_client.get("/api/issues/")

        assert response.status_code == 403

    @pytest.mark.django_db
    def test_authenticated_user_can_list_issues(
        self,
        authenticated_client,
        user,
    ):
        baker.make(
            Issue,
            reporter=user,
            _quantity=2,
        )

        response = authenticated_client.get("/api/issues/")

        assert response.status_code == 200
        assert len(response.data) == 2

    @pytest.mark.django_db
    def test_authenticated_user_can_create_issue(
        self,
        authenticated_client,
        user,
    ):
        response = authenticated_client.post(
            "/api/issues/",
            {
                "title": "New issue",
                "description": "Something is broken.",
                "status": "open",
                "priority": "high",
            },
            format="json",
        )

        assert response.status_code == 201

        issue = Issue.objects.get(pk=response.data["id"])

        assert issue.title == "New issue"
        assert issue.description == "Something is broken."
        assert issue.status == "open"
        assert issue.priority == "high"
        assert issue.reporter == user

    @pytest.mark.django_db
    def test_anonymous_user_cannot_create_issue(self, api_client):
        response = api_client.post(
            "/api/issues/",
            {
                "title": "New issue",
            },
            format="json",
        )

        assert response.status_code == 403

    @pytest.mark.django_db
    def test_create_issue_rejects_blank_title(
        self,
        authenticated_client,
    ):
        response = authenticated_client.post(
            "/api/issues/",
            {
                "title": "   ",
            },
            format="json",
        )

        assert response.status_code == 400
        assert "title" in response.data

    @pytest.mark.django_db
    def test_create_issue_rejects_invalid_status(
        self,
        authenticated_client,
    ):
        response = authenticated_client.post(
            "/api/issues/",
            {
                "title": "Test issue",
                "status": "invalid",
            },
            format="json",
        )

        assert response.status_code == 400
        assert "status" in response.data

    @pytest.mark.django_db
    def test_create_issue_rejects_invalid_priority(
        self,
        authenticated_client,
    ):
        response = authenticated_client.post(
            "/api/issues/",
            {
                "title": "Test issue",
                "priority": "invalid",
            },
            format="json",
        )

        assert response.status_code == 400
        assert "priority" in response.data

    @pytest.mark.django_db
    def test_authenticated_user_can_retrieve_issue(
        self,
        authenticated_client,
        issue,
    ):
        response = authenticated_client.get(f"/api/issues/{issue.id}/")

        assert response.status_code == 200
        assert response.data["id"] == issue.id
        assert response.data["title"] == issue.title

    @pytest.mark.django_db
    def test_authenticated_user_can_update_issue(
        self,
        authenticated_client,
        issue,
    ):
        response = authenticated_client.patch(
            f"/api/issues/{issue.id}/",
            {
                "title": "Updated title",
                "status": "in_progress",
                "priority": "high",
            },
            format="json",
        )

        assert response.status_code == 200

        issue.refresh_from_db()

        assert issue.title == "Updated title"
        assert issue.status == "in_progress"
        assert issue.priority == "high"

    @pytest.mark.django_db
    def test_authenticated_user_can_delete_issue(
        self,
        authenticated_client,
        issue,
    ):
        response = authenticated_client.delete(f"/api/issues/{issue.id}/")

        assert response.status_code == 204
        assert not Issue.objects.filter(pk=issue.id).exists()

    @pytest.mark.django_db
    def test_retrieve_nonexistent_issue_returns_404(
        self,
        authenticated_client,
    ):
        response = authenticated_client.get("/api/issues/999999/")

        assert response.status_code == 404
