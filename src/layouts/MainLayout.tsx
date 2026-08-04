import React from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Briefcase, LayoutDashboard, LogOut } from 'lucide-react'
import { useGlobalStats } from '@/services/cms/cms.store'
import { useUIStore } from '@/stores/uiStore'
import { useAuthStore } from '@/stores/authStore'
import { authService } from '@/services/auth/auth.service'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'Marketplace', to: '/marketplace' },
  { label: 'About', to: '/about' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Community', to: '/community' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
]

export const MainLayout: React.FC = () => {
  const { isMobileMenuOpen, toggleMobileMenu } = useUIStore()
  const { user, profile, clearAuth } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path: string) => location.pathname === path

  const handleLogout = async () => {
    try {
      await authService.signOut()
      toast.success('Signed out successfully')
    } catch {
      toast.error('Failed to sign out')
    } finally {
      clearAuth()
      navigate('/', { replace: true })
    }
  }

  const closeMobile = () => {
    if (isMobileMenuOpen) toggleMobileMenu()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-background/95 sticky top-0 z-40 border-b backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMobile}
            className="group flex items-center gap-2.5 transition-transform hover:scale-[0.98]"
          >
            <div className="to-primary/80 shadow-primary/20 flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary shadow-lg">
              <Briefcase className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="hidden font-heading text-xl font-black tracking-tight text-foreground sm:inline">
              Remote Jobs <span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive(link.to)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth CTA — Desktop */}
          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:bg-primary/90 flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden lg:inline">
                    {profile?.full_name?.split(' ')[0] ?? 'Sign Out'}
                  </span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hover:bg-primary/90 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Nav Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t bg-background px-4 pb-6 shadow-xl md:hidden overflow-hidden"
            >
              <nav className="flex flex-col gap-1.5 pt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMobile}
                    className={`flex min-h-[44px] items-center rounded-xl px-4 text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive(link.to)
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4 border-t border-border/50 pt-4">
                  {user ? (
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/dashboard"
                        onClick={closeMobile}
                        className="flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary px-4 text-base font-semibold text-primary-foreground shadow-sm transition-transform active:scale-95"
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          closeMobile()
                          handleLogout()
                        }}
                        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-border px-4 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
                      >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link
                        to="/login"
                        onClick={closeMobile}
                        className="flex min-h-[48px] items-center justify-center rounded-xl border border-border px-4 text-base font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={closeMobile}
                        className="flex min-h-[48px] items-center justify-center rounded-xl bg-primary px-4 text-base font-semibold text-primary-foreground shadow-sm transition-transform active:scale-95"
                      >
                        Get Started Free
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1 pb-32 pb-safe md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 border-b border-slate-800 pb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-6 w-6 text-primary" />
                <span className="font-heading text-lg font-bold text-white">
                  Remote Jobs Hub
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-6 max-w-sm text-slate-500">
                The most secure peer-to-peer marketplace for digital assets and remote work profiles.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">About Us</Link></li>
                <li><Link to="/community" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Community</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Contact & Support</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/terms" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <p>&copy; {new Date().getFullYear()} Remote Jobs Hub. All rights reserved.</p>
            
            <GlobalFooterStats />
          </div>
        </div>
      </footer>
    </div>
  )
}

function GlobalFooterStats() {
  const stats = useGlobalStats()
  return (
    <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 md:gap-4 text-slate-500">
      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> {stats.onlineNow} Online</span>
      <span className="hidden sm:inline">•</span>
      <span>{stats.users} Members</span>
      <span className="hidden sm:inline">•</span>
      <span>{stats.countries} Countries</span>
    </div>
  )
}
