import pytest
from model_bakery import baker

from projects.models import Project


@pytest.mark.django_db
class TestProjectViewSet:
    def test_anonymous_user_cannot_list_projects(self, api_client):
        response = api_client.get("/api/projects/")

        assert response.status_code == 403

    def test_authenticated_user_can_list_projects(
        self,
        authenticated_client,
        user,
    ):
        baker.make(
            Project,
            owner=user,
            _quantity=2,
        )

        response = authenticated_client.get("/api/projects/")

        assert response.status_code == 200
        assert response.data["count"] == 2
        assert len(response.data["results"]) == 2

    def test_authenticated_user_can_create_project(
        self,
        authenticated_client,
        user,
    ):
        response = authenticated_client.post(
            "/api/projects/",
            {
                "name": "IssueTracker",
                "description": "Project management application.",
            },
            format="json",
        )

        assert response.status_code == 201

        project = Project.objects.get(pk=response.data["id"])

        assert project.name == "IssueTracker"
        assert project.description == "Project management application."
        assert project.owner == user

    def test_create_project_rejects_blank_name(
        self,
        authenticated_client,
    ):
        response = authenticated_client.post(
            "/api/projects/",
            {
                "name": "   ",
            },
            format="json",
        )

        assert response.status_code == 400
        assert "name" in response.data

    def test_authenticated_user_can_retrieve_project(
        self,
        authenticated_client,
        project,
    ):
        response = authenticated_client.get(f"/api/projects/{project.id}/")

        assert response.status_code == 200
        assert response.data["id"] == project.id
        assert response.data["name"] == project.name

    def test_authenticated_user_can_update_project(
        self,
        authenticated_client,
        project,
    ):
        response = authenticated_client.patch(
            f"/api/projects/{project.id}/",
            {
                "name": "Updated project",
            },
            format="json",
        )

        assert response.status_code == 200

        project.refresh_from_db()

        assert project.name == "Updated project"

    def test_authenticated_user_can_delete_project(
        self,
        authenticated_client,
        project,
    ):
        response = authenticated_client.delete(f"/api/projects/{project.id}/")

        assert response.status_code == 204
        assert not Project.objects.filter(pk=project.id).exists()

    def test_retrieve_nonexistent_project_returns_404(
        self,
        authenticated_client,
    ):
        response = authenticated_client.get("/api/projects/999999/")

        assert response.status_code == 404

    def test_user_only_sees_owned_projects(
        self,
        authenticated_client,
        user,
    ):
        another_user = baker.make(
            "accounts.User",
            username="anotheruser",
        )

        owned_project = baker.make(
            Project,
            owner=user,
        )

        baker.make(
            Project,
            owner=another_user,
        )

        response = authenticated_client.get("/api/projects/")

        assert response.status_code == 200
        assert response.data["count"] == 1
        assert response.data["results"][0]["id"] == owned_project.id

    def test_user_cannot_update_another_users_project(
        self,
        authenticated_client,
    ):
        another_user = baker.make(
            "accounts.User",
            username="anotheruser",
        )

        project = baker.make(
            Project,
            owner=another_user,
        )

        response = authenticated_client.patch(
            f"/api/projects/{project.id}/",
            {
                "name": "Hacked project",
            },
            format="json",
        )

        assert response.status_code == 404

    def test_user_cannot_delete_another_users_project(
        self,
        authenticated_client,
    ):
        another_user = baker.make(
            "accounts.User",
            username="anotheruser",
        )

        project = baker.make(
            Project,
            owner=another_user,
        )

        response = authenticated_client.delete(f"/api/projects/{project.id}/")

        assert response.status_code == 404
        assert Project.objects.filter(pk=project.id).exists()
