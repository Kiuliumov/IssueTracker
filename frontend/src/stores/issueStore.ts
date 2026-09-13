import { makeAutoObservable, runInAction } from "mobx";

import {
  createIssue,
  deleteIssue,
  getIssue,
  getIssues,
  updateIssue,
  type Issue,
  type IssueInput,
} from "@/lib/issues";

class IssueStore {
  issues: Issue[] = [];
  currentIssue: Issue | null = null;

  loading = false;
  error: string | null = null;

  currentPage = 1;
  totalIssues = 0;
  hasNextPage = false;
  hasPreviousPage = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchIssues(page = 1) {
    this.loading = true;
    this.error = null;

    try {
      const data = await getIssues(page);

      runInAction(() => {
        this.issues = data.results;
        this.totalIssues = data.count;
        this.currentPage = page;
        this.hasNextPage = Boolean(data.next);
        this.hasPreviousPage = Boolean(data.previous);
        this.loading = false;
      });
    } catch {
      runInAction(() => {
        this.error = "Failed to load issues.";
        this.loading = false;
      });
    }
  }

  async fetchIssue(id: number) {
    this.loading = true;
    this.error = null;

    try {
      const issue = await getIssue(id);

      runInAction(() => {
        this.currentIssue = issue;
        this.loading = false;
      });

      return issue;
    } catch {
      runInAction(() => {
        this.error = "Failed to load issue.";
        this.loading = false;
      });

      throw new Error("Failed to load issue.");
    }
  }

  async create(data: IssueInput) {
    this.error = null;

    try {
      const issue = await createIssue(data);

      runInAction(() => {
        this.issues.unshift(issue);
        this.totalIssues += 1;
      });

      return issue;
    } catch {
      runInAction(() => {
        this.error = "Failed to create issue.";
      });

      throw new Error("Failed to create issue.");
    }
  }

  async update(id: number, data: IssueInput) {
    this.error = null;

    try {
      const issue = await updateIssue(id, data);

      runInAction(() => {
        this.issues = this.issues.map((item) =>
          item.id === id ? issue : item,
        );

        if (this.currentIssue?.id === id) {
          this.currentIssue = issue;
        }
      });

      return issue;
    } catch {
      runInAction(() => {
        this.error = "Failed to update issue.";
      });

      throw new Error("Failed to update issue.");
    }
  }

  async remove(id: number) {
    this.error = null;

    try {
      await deleteIssue(id);

      runInAction(() => {
        this.issues = this.issues.filter((issue) => issue.id !== id);
        this.totalIssues -= 1;

        if (this.currentIssue?.id === id) {
          this.currentIssue = null;
        }
      });
    } catch {
      runInAction(() => {
        this.error = "Failed to delete issue.";
      });

      throw new Error("Failed to delete issue.");
    }
  }
}

const issueStore = new IssueStore();

export default issueStore;
