"use client";

import { observer } from "mobx-react-lite";

import projectStore from "@/stores/projectStore";

function ProjectPagination() {
  if (projectStore.totalProjects <= 9) {
    return null;
  }

  return (
    <div className="mt-8 flex items-center justify-between border-t border-gray-800 pt-6">
      <p className="text-sm text-gray-400">Page {projectStore.currentPage}</p>

      <div className="flex gap-3">
        <button
          type="button"
          disabled={!projectStore.hasPreviousPage || projectStore.loading}
          onClick={() =>
            projectStore.fetchProjects(projectStore.currentPage - 1)
          }
          className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <button
          type="button"
          disabled={!projectStore.hasNextPage || projectStore.loading}
          onClick={() =>
            projectStore.fetchProjects(projectStore.currentPage + 1)
          }
          className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-gray-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default observer(ProjectPagination);
