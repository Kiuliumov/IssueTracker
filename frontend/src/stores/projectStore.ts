import { makeAutoObservable, runInAction } from "mobx";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  type Project,
  type ProjectInput,
} from "@/lib/projects";

class ProjectStore {
  projects: Project[] = [];
  loading = false;
  error: string | null = null;

  currentPage = 1;
  totalProjects = 0;
  hasNextPage = false;
  hasPreviousPage = false;
  searchQuery = "";

  constructor() {
    makeAutoObservable(this);
  }

  get filteredProjects() {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) {
      return this.projects;
    }

    return this.projects.filter(
      (project) =>
        project.name.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query),
    );
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  async fetchProjects(page = 1) {
    this.loading = true;
    this.error = null;

    try {
      const data = await getProjects(page);

      runInAction(() => {
        this.projects = data.results;
        this.totalProjects = data.count;
        this.currentPage = page;
        this.hasNextPage = Boolean(data.next);
        this.hasPreviousPage = Boolean(data.previous);
        this.loading = false;
      });
    } catch {
      runInAction(() => {
        this.error = "Failed to load projects.";
        this.loading = false;
      });
    }
  }

  async create(data: ProjectInput) {
    this.error = null;

    try {
      const project = await createProject(data);

      runInAction(() => {
        this.projects.unshift(project);
        this.totalProjects += 1;
      });

      return project;
    } catch {
      runInAction(() => {
        this.error = "Failed to create project.";
      });

      throw new Error("Failed to create project.");
    }
  }

  async update(id: number, data: ProjectInput) {
    this.error = null;

    try {
      const project = await updateProject(id, data);

      runInAction(() => {
        this.projects = this.projects.map((item) =>
          item.id === id ? project : item,
        );
      });

      return project;
    } catch {
      runInAction(() => {
        this.error = "Failed to update project.";
      });

      throw new Error("Failed to update project.");
    }
  }

  async remove(id: number) {
    this.error = null;

    try {
      await deleteProject(id);

      runInAction(() => {
        this.projects = this.projects.filter((project) => project.id !== id);
        this.totalProjects -= 1;
      });
    } catch {
      runInAction(() => {
        this.error = "Failed to delete project.";
      });

      throw new Error("Failed to delete project.");
    }
  }
}

const projectStore = new ProjectStore();

export default projectStore;
