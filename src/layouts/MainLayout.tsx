import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { Menu, X, Briefcase } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
export const MainLayout: React.FC = () => {
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore()
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="font-heading text-xl font-bold">Remote Jobs Hub</span>
          </Link>
          <nav className="hidden space-x-6 md:flex">
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/about">About</Link>
            <Link to="/pricing">Pricing</Link>
            <Link to="/community">Community</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/login">Login</Link>
          </nav>
          <button onClick={toggleMobileMenu} className="rounded p-2 hover:bg-muted md:hidden">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {isMobileMenuOpen && (
          <div className="border-b bg-background px-4 py-2 md:hidden">
            <nav className="flex flex-col space-y-3 py-2">
              <Link to="/marketplace" onClick={toggleMobileMenu}>Marketplace</Link>
              <Link to="/about" onClick={toggleMobileMenu}>About</Link>
              <Link to="/pricing" onClick={toggleMobileMenu}>Pricing</Link>
              <Link to="/community" onClick={toggleMobileMenu}>Community</Link>
              <Link to="/faq" onClick={toggleMobileMenu}>FAQ</Link>
              <Link to="/contact" onClick={toggleMobileMenu}>Contact</Link>
              <Link to="/login" onClick={toggleMobileMenu}>Login</Link>
            </nav>
          </div>
        )}
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t bg-muted py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Remote Jobs Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}