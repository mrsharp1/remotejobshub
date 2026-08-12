import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { MainLayout } from '@/layouts/MainLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { LoadingScreen } from '@/components/shared/LoadingScreen'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { DeveloperConsole } from '@/components/shared/DeveloperConsole'
import { DebugPanel } from '@/components/shared/DebugPanel'

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
const CheckoutPage = lazy(() =>
  import('@/pages/public/CheckoutPage').then((m) => ({
    default: m.CheckoutPage,
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

// --- Added Missing Pages ---
const CookiesPage = lazy(() => import('@/pages/public/CookiesPage').then(m => ({ default: m.CookiesPage })))
const PrivacyPage = lazy(() => import('@/pages/public/PrivacyPage').then(m => ({ default: m.PrivacyPage })))
const TermsPage = lazy(() => import('@/pages/public/TermsPage').then(m => ({ default: m.TermsPage })))
const HowItWorksPage = lazy(() => import('@/pages/public/HowItWorksPage').then(m => ({ default: m.HowItWorksPage })))
const VideoGuidePage = lazy(() => import('@/pages/public/VideoGuidePage').then(m => ({ default: m.VideoGuidePage })))


// --- Trust & Knowledge Center ---
const TrustCenterPage = lazy(() => import('@/pages/public/TrustCenterPage').then(m => ({ default: m.TrustCenterPage })))
const HelpCenterPage = lazy(() => import('@/pages/public/HelpCenterPage').then(m => ({ default: m.HelpCenterPage })))
const KnowledgeBasePage = lazy(() => import('@/pages/public/KnowledgeBasePage').then(m => ({ default: m.KnowledgeBasePage })))
const InteractiveJourneyPage = lazy(() => import('@/pages/public/InteractiveJourneyPage').then(m => ({ default: m.InteractiveJourneyPage })))
const PlatformStatusPage = lazy(() => import('@/pages/public/PlatformStatusPage').then(m => ({ default: m.PlatformStatusPage })))
const DownloadCenterPage = lazy(() => import('@/pages/public/DownloadCenterPage').then(m => ({ default: m.DownloadCenterPage })))
const GlobalSearchPage = lazy(() => import('@/pages/public/GlobalSearchPage').then(m => ({ default: m.GlobalSearchPage })))
const EducationHubPage = lazy(() => import('@/pages/public/EducationHubPage').then(m => ({ default: m.EducationHubPage })))

// --- Phase 040 Company Ecosystem ---
const SuccessWallPro = lazy(() => import('@/pages/public/SuccessWallPro').then(m => ({ default: m.SuccessWallPro })))
const CustomerStories = lazy(() => import('@/pages/public/CustomerStories').then(m => ({ default: m.CustomerStories })))
const StoryDetail = lazy(() => import('@/pages/public/StoryDetail').then(m => ({ default: m.StoryDetail })))
const VideoTestimonialHub = lazy(() => import('@/pages/public/VideoTestimonialHub').then(m => ({ default: m.VideoTestimonialHub })))
const PhotoTestimonials = lazy(() => import('@/pages/public/PhotoTestimonials').then(m => ({ default: m.PhotoTestimonials })))
const NewsroomPage = lazy(() => import('@/pages/public/NewsroomPage').then(m => ({ default: m.NewsroomPage })))
const PressCenterPage = lazy(() => import('@/pages/public/PressCenterPage').then(m => ({ default: m.PressCenterPage })))
const CareersPage = lazy(() => import('@/pages/public/CareersPage').then(m => ({ default: m.CareersPage })))
const PartnerProgramPage = lazy(() => import('@/pages/public/PartnerProgramPage').then(m => ({ default: m.PartnerProgramPage })))
const AffiliateProgramPage = lazy(() => import('@/pages/public/AffiliateProgramPage').then(m => ({ default: m.AffiliateProgramPage })))
const BrandKitPage = lazy(() => import('@/pages/public/BrandKitPage').then(m => ({ default: m.BrandKitPage })))
const PublicMediaLibraryPage = lazy(() => import('@/pages/public/PublicMediaLibraryPage').then(m => ({ default: m.PublicMediaLibraryPage })))
const CompanyTimelinePage = lazy(() => import('@/pages/public/CompanyTimelinePage').then(m => ({ default: m.CompanyTimelinePage })))
const EventsPage = lazy(() => import('@/pages/public/EventsPage').then(m => ({ default: m.EventsPage })))
const AwardsPage = lazy(() => import('@/pages/public/AwardsPage').then(m => ({ default: m.AwardsPage })))
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
const UpdatePasswordPage = lazy(() =>
  import('@/pages/auth/UpdatePasswordPage').then((m) => ({
    default: m.UpdatePasswordPage,
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
const CredentialVaultPage = lazy(() =>
  import('@/pages/dashboard/CredentialVaultPage').then((m) => ({
    default: m.CredentialVaultPage,
  }))
)
const VerificationWorkspacePage = lazy(() =>
  import('@/pages/dashboard/VerificationWorkspacePage').then((m) => ({
    default: m.VerificationWorkspacePage,
  }))
)
const EscrowSettlementPage = lazy(() =>
  import('@/pages/dashboard/EscrowSettlementPage').then((m) => ({
    default: m.EscrowSettlementPage,
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
  import('@/features/messaging/pages/MessagesPage').then((m) => ({
    default: m.MessagesPage,
  }))
)
const SellerMessagesPage = lazy(() =>
  import('@/features/messaging/pages/MessagesPage').then((m) => ({
    default: m.MessagesPage,
  }))
)
const AdminMessagesPage = lazy(() =>
  import('@/features/messaging/pages/AdminMessagesPage').then((m) => ({
    default: m.AdminMessagesPage,
  }))
)
const SellerSettingsPage = lazy(() =>
  import('@/pages/seller/SellerSettingsPage').then((m) => ({
    default: m.SellerSettingsPage,
  }))
)
const BuyerWalletPage = lazy(() =>
  import('@/pages/dashboard/BuyerWalletPage').then((m) => ({
    default: m.BuyerWalletPage,
  }))
)
const PaymentVerifyPage = lazy(() =>
  import('@/pages/dashboard/PaymentVerifyPage').then((m) => ({
    default: m.PaymentVerifyPage,
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
const AdminCMSPage = lazy(() =>
  import('@/pages/admin/AdminCMSPage').then((m) => ({
    default: m.AdminCMSPage,
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
const BuyerPromotionsPage = lazy(() =>
  import('@/pages/dashboard/BuyerPromotionsPage').then((m) => ({
    default: m.BuyerPromotionsPage,
  }))
)
const SellerPromotionsPage = lazy(() =>
  import('@/pages/seller/SellerPromotionsPage').then((m) => ({
    default: m.SellerPromotionsPage,
  }))
)
const AdminPromotionsPage = lazy(() =>
  import('@/pages/admin/AdminPromotionsPage').then((m) => ({
    default: m.AdminPromotionsPage,
  }))
)
const BuyerSecurityPage = lazy(() =>
  import('@/pages/dashboard/BuyerSecurityPage').then((m) => ({
    default: m.BuyerSecurityPage,
  }))
)
const SellerSecurityPage = lazy(() =>
  import('@/pages/seller/SellerSecurityPage').then((m) => ({
    default: m.SellerSecurityPage,
  }))
)
const AdminRiskPage = lazy(() =>
  import('@/pages/admin/AdminRiskPage').then((m) => ({
    default: m.AdminRiskPage,
  }))
)
const AdminSecurityPage = lazy(() =>
  import('@/pages/admin/AdminSecurityPage').then((m) => ({
    default: m.AdminSecurityPage,
  }))
)
const AdminAIInsightsPage = lazy(() =>
  import('@/pages/admin/AdminAIInsightsPage').then((m) => ({
    default: m.AdminAIInsightsPage,
  }))
)
const AdminAutomationPage = lazy(() =>
  import('@/pages/admin/AdminAutomationPage').then((m) => ({
    default: m.AdminAutomationPage,
  }))
)

const RootLayout: React.FC = () => {
  return (
    <>
      <Outlet />
      <DeveloperConsole />
      {import.meta.env.DEV && <DebugPanel />}
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
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
        path: 'checkout/:id',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <CheckoutPage />
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
        path: 'trust',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <TrustCenterPage />
          </Suspense>
        ),
      },
      {
        path: 'help',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <HelpCenterPage />
          </Suspense>
        ),
      },
      {
        path: 'knowledge',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <KnowledgeBasePage />
          </Suspense>
        ),
      },
      {
        path: 'journey',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <InteractiveJourneyPage />
          </Suspense>
        ),
      },
      {
        path: 'status',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <PlatformStatusPage />
          </Suspense>
        ),
      },
      {
        path: 'downloads',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <DownloadCenterPage />
          </Suspense>
        ),
      },
      {
        path: 'search',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <GlobalSearchPage />
          </Suspense>
        ),
      },
      {
        path: 'education',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <EducationHubPage />
          </Suspense>
        ),
      },
      {
        path: 'success',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SuccessWallPro />
          </Suspense>
        ),
      },
      {
        path: 'stories',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <CustomerStories />
          </Suspense>
        ),
      },
      {
        path: 'stories/:slug',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <StoryDetail />
          </Suspense>
        ),
      },
      {
        path: 'testimonials/video',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <VideoTestimonialHub />
          </Suspense>
        ),
      },
      {
        path: 'testimonials/photos',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <PhotoTestimonials />
          </Suspense>
        ),
      },
      {
        path: 'newsroom',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <NewsroomPage />
          </Suspense>
        ),
      },
      {
        path: 'press',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <PressCenterPage />
          </Suspense>
        ),
      },
      {
        path: 'careers',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <CareersPage />
          </Suspense>
        ),
      },
      {
        path: 'partners',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <PartnerProgramPage />
          </Suspense>
        ),
      },
      {
        path: 'affiliates',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AffiliateProgramPage />
          </Suspense>
        ),
      },
      {
        path: 'brand',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <BrandKitPage />
          </Suspense>
        ),
      },
      {
        path: 'media',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <PublicMediaLibraryPage />
          </Suspense>
        ),
      },
      {
        path: 'timeline',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <CompanyTimelinePage />
          </Suspense>
        ),
      },
      {
        path: 'events',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <EventsPage />
          </Suspense>
        ),
      },
      {
        path: 'awards',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AwardsPage />
          </Suspense>
        ),
      },
      {
        path: 'cookies',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <CookiesPage />
          </Suspense>
        ),
      },
      {
        path: 'privacy',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <PrivacyPage />
          </Suspense>
        ),
      },
      {
        path: 'terms',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <TermsPage />
          </Suspense>
        ),
      },
      {
        path: 'how-it-works',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <HowItWorksPage />
          </Suspense>
        ),
      },
      {
        path: 'guides',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <VideoGuidePage />
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
      {
        path: 'reset-password',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <UpdatePasswordPage />
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
        path: 'seller/settings',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SellerSettingsPage />
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
        path: 'vault/:id',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <CredentialVaultPage />
          </Suspense>
        ),
      },
      {
        path: 'verification/:id',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <VerificationWorkspacePage />
          </Suspense>
        ),
      },
      {
        path: 'settlement/:id',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <EscrowSettlementPage />
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
        path: 'dashboard/payment/verify',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <PaymentVerifyPage />
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
      {
        path: 'dashboard/promotions',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <BuyerPromotionsPage />
          </Suspense>
        ),
      },
      {
        path: 'seller/promotions',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SellerPromotionsPage />
          </Suspense>
        ),
      },
      {
        path: 'dashboard/security',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <BuyerSecurityPage />
          </Suspense>
        ),
      },
      {
        path: 'seller/security',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <SellerSecurityPage />
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
      {
        path: 'admin/promotions',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminPromotionsPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/risk',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminRiskPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/security',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminSecurityPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/ai-insights',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminAIInsightsPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/automation',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminAutomationPage />
          </Suspense>
        ),
      },
      {
        path: 'admin/cms',
        element: (
          <Suspense fallback={<LoadingScreen />}>
            <AdminCMSPage />
          </Suspense>
        ),
      },
    ],
  },
]
  }
])

export const AppRoutes: React.FC = () => <RouterProvider router={router} />
