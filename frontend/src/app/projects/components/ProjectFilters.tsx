"use client";

import { observer } from "mobx-react-lite";

import Input from "@/components/ui/Input";
import projectStore from "@/stores/projectStore";

function ProjectFilters() {
  return (
    <div className="mb-6">
      <Input
        type="search"
        placeholder="Search projects..."
        value={projectStore.searchQuery}
        onChange={(event) => projectStore.setSearchQuery(event.target.value)}
        className="max-w-md"
      />
    </div>
  );
}

export default observer(ProjectFilters);
