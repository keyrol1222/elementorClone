import { create } from "zustand";
import { persist } from "zustand/middleware";

type ProjectState = {
  activeProjectId: string | null;
  setActiveProjectId: (projectId: string | null) => void;
};

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      activeProjectId: null,
      setActiveProjectId: (projectId) => set({ activeProjectId: projectId }),
    }),
    {
      name: "pagecraft-active-project",
    },
  ),
);
