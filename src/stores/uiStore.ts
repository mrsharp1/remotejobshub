import { create } from 'zustand'
interface UIState {
  isSidebarOpen: boolean
  isMobileMenuOpen: boolean
  toggleSidebar: () => void
  toggleMobileMenu: () => void
  setSidebarOpen: (isOpen: boolean) => void
  setMobileMenuOpen: (isOpen: boolean) => void
}
export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: true,
  isMobileMenuOpen: false,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
}))
