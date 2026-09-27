import { create } from "zustand";

interface LearnSidebarState {
  isOpen: boolean;
  toggle: () => void;
  setOpen: (open: boolean) => void;
}

/**
 * Zustand store for the learn-layout filter sidebar.
 * Shared across chord, family, and interval routes so sidebar state
 * survives route transitions and doesn't live inside route components.
 *
 * Usage:
 *   const { isOpen, toggle } = useLearnSidebarStore();
 *   // or with selector to limit rerenders:
 *   const isOpen = useLearnSidebarStore(s => s.isOpen);
 */
export const useLearnSidebarStore = create<LearnSidebarState>((set) => ({
  isOpen: true,
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  setOpen: (open) => set({ isOpen: open }),
}));
