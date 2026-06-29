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
const BuyerOrdersPage = lazy(() =>
  import('@/pages/dashboard/BuyerOrdersPage').then((m) => ({
    default: m.BuyerOrdersPage,
  }))
)
const NotificationsPage = lazy(() =>
  import('@/pages/dashboard/NotificationsPage').then((m) => ({
    default: m.NotificationsPage,
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
const AdminListingsPage = lazy(() =>
  import('@/pages/admin/AdminListingsPage').then((m) => ({
    default: m.AdminListingsPage,
  }))
)
const AdminDisputesPage = lazy(() =>
  import('@/pages/admin/AdminDisputesPage').then((m) => ({
    default: m.AdminDisputesPage,
  }))
)
const BuyerPaymentsPage = lazy(() =>
  import('@/pages/dashboard/BuyerPaymentsPage').then((m) => ({
    default: m.BuyerPaymentsPage,
  }))
)
const SellerPaymentsPage = lazy(() =>
  import('@/pages/seller/SellerPaymentsPage').then((m) => ({
    default: m.SellerPaymentsPage,
  }))
)
const AdminPaymentsPage = lazy(() =>
  import('@/pages/admin/AdminPaymentsPage').then((m) => ({
    default: m.AdminPaymentsPage,
  }))
)
const AdminReviewsPage = lazy(() =>
  import('@/pages/admin/AdminReviewsPage').then((m) => ({
    default: m.AdminReviewsPage,
  }))
)
const BuyerMessagesPage = lazy(() =>
  import('@/pages/dashboard/BuyerMessagesPage').then((m) => ({
    default: m.BuyerMessagesPage,
  }))
)
const SellerMessagesPage = lazy(() =>
  import('@/pages/seller/SellerMessagesPage').then((m) => ({
    default: m.SellerMessagesPage,
  }))
)
const AdminMessagesPage = lazy(() =>
  import('@/pages/admin/AdminMessagesPage').then((m) => ({
    default: m.AdminMessagesPage,
  }))
)
const BuyerWalletPage = lazy(() =>
  import('@/pages/dashboard/BuyerWalletPage').then((m) => ({
    default: m.BuyerWalletPage,
  }))
)
const SellerWalletPage = lazy(() =>
  import('@/pages/seller/SellerWalletPage').then((m) => ({
    default: m.SellerWalletPage,
  }))
)
const AdminWalletsPage = lazy(() =>
  import('@/pages/admin/AdminWalletsPage').then((m) => ({
    default: m.AdminWalletsPage,
  }))
)
const AdminBroadcastsPage = lazy(() =>
  import('@/pages/admin/AdminBroadcastsPage').then((m) => ({
    default: m.AdminBroadcastsPage,
  }))
)
const NotificationPreferencesPage = lazy(() =>
  import('@/pages/dashboard/NotificationPreferencesPage').then((m) => ({
    default: m.NotificationPreferencesPage,
  }))
)
const BuyerReferralPage = lazy(() =>
  import('@/pages/dashboard/BuyerReferralPage').then((m) => ({
    default: m.BuyerReferralPage,
  }))
)
const SellerReferralPage = lazy(() =>
  import('@/pages/seller/SellerReferralPage').then((m) => ({
    default: m.SellerReferralPage,
  }))
)
const AdminReferralsPage = lazy(() =>
  import('@/pages/admin/AdminReferralsPage').then((m) => ({
    default: m.AdminReferralsPage,
  }))
)
const SellerVerificationPage = lazy(() =>
  import('@/pages/seller/SellerVerificationPage').then((m) => ({
    default: m.SellerVerificationPage,
  }))
)
const AdminVerificationPage = lazy(() =>
  import('@/pages/admin/AdminVerificationPage').then((m) => ({
    default: m.AdminVerificationPage,
  }))
)
const AdminAnalyticsPage = lazy(() =>
  import('@/pages/admin/AdminAnalyticsPage').then((m) => ({
    default: m.AdminAnalyticsPage,
  }))
)
const SellerAnalyticsPage = lazy(() =>
  import('@/pages/seller/SellerAnalyticsPage').then((m) => ({
    default: m.SellerAnalyticsPage,
  }))
)
const BuyerAnalyticsPage = lazy(() =>
  import('@/pages/dashboard/BuyerAnalyticsPage').then((m) => ({
    default: m.BuyerAnalyticsPage,
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
        path: 'dashboard/orders',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <BuyerOrdersPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/notifications',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <NotificationsPage />
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
      {
        path: 'dashboard/payments',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <BuyerPaymentsPage />
          </Suspense>
        ),
      },
      {
        path: 'seller/payments',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SellerPaymentsPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/messages',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <BuyerMessagesPage />
          </Suspense>
        ),
      },
      {
        path: 'seller/messages',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SellerMessagesPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/wallet',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <BuyerWalletPage />
          </Suspense>
        ),
      },
      {
        path: 'seller/wallet',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SellerWalletPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/settings/notifications',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <NotificationPreferencesPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/referrals',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <BuyerReferralPage />
          </Suspense>
        ),
      },
      {
        path: 'seller/referrals',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SellerReferralPage />
          </Suspense>
        ),
      },
      {
        path: 'seller/verification',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SellerVerificationPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/analytics',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <BuyerAnalyticsPage />
          </Suspense>
        ),
      },
      {
        path: 'seller/analytics',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SellerAnalyticsPage />
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
      {
        path: 'admin/listings',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminListingsPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/disputes',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminDisputesPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/payments',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminPaymentsPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/reviews',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminReviewsPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/messages',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminMessagesPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/wallets',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminWalletsPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/broadcasts',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminBroadcastsPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/referrals',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminReferralsPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/verification',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminVerificationPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/analytics',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminAnalyticsPage />
          </Suspense>
        ),
      },
    ],
  },
])

export const AppRoutes: React.FC = () => <RouterProvider router={router} />
