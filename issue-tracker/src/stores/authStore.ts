import { makeAutoObservable, runInAction } from "mobx";

import api from "@/lib/api";

export type User = {
  username: string;
  email: string;
};

class AuthStore {
  user: User | null = null;
  loading = false;
  initialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchUser() {
    this.loading = true;

    try {
      const response = await api.get<User>("/accounts/me/");

      runInAction(() => {
        this.user = response.data;
        this.loading = false;
        this.initialized = true;
      });
    } catch {
      runInAction(() => {
        this.user = null;
        this.loading = false;
        this.initialized = true;
      });
    }
  }

  async logout() {
    try {
      await api.post("/accounts/logout/");
    } finally {
      runInAction(() => {
        this.user = null;
      });
    }
  }
}

const authStore = new AuthStore();

export default authStore;