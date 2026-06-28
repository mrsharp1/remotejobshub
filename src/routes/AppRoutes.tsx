import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

const HomePage = lazy(() =>
  import('@/pages/public/HomePage').then((m) => ({ default: m.HomePage }))
)
const MarketplacePage = lazy(() =>
  import('@/pages/public/MarketplacePage').then((m) => ({
    default: m.MarketplacePage,
  }))
)
const ListingDetailPage = lazy(() =>
  import('@/pages/public/ListingDetailPage').then((m) => ({
    default: m.ListingDetailPage,
  }))
)
const AboutPage = lazy(() =>
  import('@/pages/public/AboutPage').then((m) => ({ default: m.AboutPage }))
)
const ContactPage = lazy(() =>
  import('@/pages/public/ContactPage').then((m) => ({ default: m.ContactPage }))
)
const PricingPage = lazy(() =>
  import('@/pages/public/PricingPage').then((m) => ({ default: m.PricingPage }))
)
const CommunityPage = lazy(() =>
  import('@/pages/public/CommunityPage').then((m) => ({
    default: m.CommunityPage,
  }))
)
const FaqPage = lazy(() =>
  import('@/pages/public/FaqPage').then((m) => ({ default: m.FaqPage }))
)
const NotFoundPage = lazy(() =>
  import('@/pages/public/NotFoundPage').then((m) => ({
    default: m.NotFoundPage,
  }))
)
const LoginPage = lazy(() =>
  import('@/pages/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
)
const RegisterPage = lazy(() =>
  import('@/pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage }))
)
const ForgotPasswordPage = lazy(() =>
  import('@/pages/auth/ForgotPasswordPage').then((m) => ({
    default: m.ForgotPasswordPage,
  }))
)
const DashboardOverviewPage = lazy(() =>
  import('@/pages/dashboard/DashboardOverviewPage').then((m) => ({
    default: m.DashboardOverviewPage,
  }))
)
const OrderDetailPage = lazy(() =>
  import('@/pages/dashboard/OrderDetailPage').then((m) => ({
    default: m.OrderDetailPage,
  }))
)
const SellerDashboardPage = lazy(() =>
  import('@/pages/seller/SellerDashboardPage').then((m) => ({
    default: m.SellerDashboardPage,
  }))
)
const SellerOrdersPage = lazy(() =>
  import('@/pages/seller/SellerOrdersPage').then((m) => ({
    default: m.SellerOrdersPage,
  }))
)
const AdminDashboardPage = lazy(() =>
  import('@/pages/admin/AdminDashboardPage').then((m) => ({
    default: m.AdminDashboardPage,
  }))
)

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'marketplace',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <MarketplacePage />
          </Suspense>
        ),
      },
      {
        path: 'listing/:id',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <ListingDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: 'contact',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: 'pricing',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <PricingPage />
          </Suspense>
        ),
      },
      {
        path: 'community',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <CommunityPage />
          </Suspense>
        ),
      },
      {
        path: 'faq',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <FaqPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: 'forgot-password',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <ForgotPasswordPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <DashboardLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DashboardOverviewPage />
          </Suspense>
        ),
      },
      {
        path: 'seller',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SellerDashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'orders/:id',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <OrderDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'seller/orders',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SellerOrdersPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: <AdminLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: 'admin',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminDashboardPage />
          </Suspense>
        ),
      },
    ],
  },
])

export const AppRoutes: React.FC = () => <RouterProvider router={router} />
