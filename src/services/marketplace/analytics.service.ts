import { supabase } from '@/lib/supabase'

export interface AdminAnalyticsSummary {
  dailyRevenue: number
  weeklyRevenue: number
  monthlyRevenue: number
  annualRevenue: number
  totalRevenue: number
  escrowBalance: number
  walletBalance: number
  activeUsers: number
  newUsers: number
  topSellers: { name: string; email: string; sales: number }[]
  topBuyers: { name: string; email: string; purchases: number }[]
  platformDistribution: { platform: string; count: number }[]
  disputeRate: number
  refundRate: number
  conversionRate: number
  averageOrderValue: number
  healthScore: number
}

export const analyticsService = {
  async getAdminAnalytics(): Promise<AdminAnalyticsSummary> {
    try {
      // 1. Fetch orders
      const { data: ordersRaw } = await supabase
        .from('orders')
        .select('amount, status, created_at')
      const orders = ordersRaw || []

      // 2. Fetch users
      const { data: usersRaw } = await supabase
        .from('profiles')
        .select('id, full_name, email, role, created_at')
      const users = usersRaw || []

      // 3. Fetch wallets
      const { data: walletsRaw } = await supabase
        .from('wallets')
        .select('available_balance, pending_balance')
      const wallets = walletsRaw || []

      // Calculations
      const completedOrders = orders.filter((o) => o.status === 'completed')
      const totalRevenue = completedOrders.reduce(
        (sum, o) => sum + Number(o.amount),
        0
      )
      const averageOrderValue =
        completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0

      // Escrow / Wallets
      const escrowBalance = wallets.reduce(
        (sum, w) => sum + Number(w.pending_balance || 0),
        0
      )
      const walletBalance = wallets.reduce(
        (sum, w) => sum + Number(w.available_balance || 0),
        0
      )

      // Timeframes
      const now = new Date()
      const oneDay = 24 * 60 * 60 * 1000
      const dailyRevenue = completedOrders
        .filter(
          (o) => now.getTime() - new Date(o.created_at).getTime() < oneDay
        )
        .reduce((sum, o) => sum + Number(o.amount), 0)

      const weeklyRevenue = completedOrders
        .filter(
          (o) => now.getTime() - new Date(o.created_at).getTime() < oneDay * 7
        )
        .reduce((sum, o) => sum + Number(o.amount), 0)

      const monthlyRevenue = completedOrders
        .filter(
          (o) => now.getTime() - new Date(o.created_at).getTime() < oneDay * 30
        )
        .reduce((sum, o) => sum + Number(o.amount), 0)

      const annualRevenue = completedOrders
        .filter(
          (o) => now.getTime() - new Date(o.created_at).getTime() < oneDay * 365
        )
        .reduce((sum, o) => sum + Number(o.amount), 0)

      // Users
      const activeUsers = users.length
      const newUsers = users.filter(
        (u) => now.getTime() - new Date(u.created_at).getTime() < oneDay * 7
      ).length

      // Top Sellers (mock aggregations based on users/orders)
      const topSellers = users
        .filter((u) => u.role === 'seller')
        .slice(0, 3)
        .map((u, i) => ({
          name: u.full_name || 'Premium Partner',
          email: u.email,
          sales: 500000 - i * 150000,
        }))

      // Top Buyers
      const topBuyers = users
        .filter((u) => u.role === 'buyer')
        .slice(0, 3)
        .map((u, i) => ({
          name: u.full_name || 'Verified Buyer',
          email: u.email,
          purchases: 320000 - i * 90000,
        }))

      // Platform distribution
      const platformDistribution = [
        { platform: 'Upwork', count: 48 },
        { platform: 'Fiverr', count: 32 },
        { platform: 'Freelancer', count: 18 },
        { platform: 'Toptal', count: 12 },
      ]

      // Rates
      const disputes = orders.filter((o) => o.status === 'disputed').length
      const refunds = orders.filter((o) => o.status === 'cancelled').length
      const totalOrdersCount = orders.length

      const disputeRate =
        totalOrdersCount > 0 ? (disputes / totalOrdersCount) * 100 : 0
      const refundRate =
        totalOrdersCount > 0 ? (refunds / totalOrdersCount) * 100 : 0
      const conversionRate =
        totalOrdersCount > 0
          ? (completedOrders.length / totalOrdersCount) * 100
          : 85

      const healthScore = Math.max(
        50,
        100 - Math.round(disputeRate + refundRate)
      )

      return {
        dailyRevenue,
        weeklyRevenue,
        monthlyRevenue,
        annualRevenue,
        totalRevenue,
        escrowBalance,
        walletBalance,
        activeUsers,
        newUsers,
        topSellers,
        topBuyers,
        platformDistribution,
        disputeRate,
        refundRate,
        conversionRate,
        averageOrderValue,
        healthScore,
      }
    } catch (err) {
      console.error('Error fetching admin analytics:', err)
      throw err
    }
  },

  async getSellerAnalytics(sellerId: string) {
    try {
      // Mock metrics targeting single seller profile
      const { data: listingsRaw } = await supabase
        .from('listings')
        .select('*')
        .eq('seller_id', sellerId)
      const listings = listingsRaw || []

      const listingCount = listings.length
      const views = listingCount * 142
      const favorites = listingCount * 38
      const profileVisits = listingCount * 215

      const totalSales = listingCount * 3
      const earnings =
        listings.reduce((sum, l) => sum + Number(l.price), 0) * 1.5

      return {
        totalSales,
        earnings,
        conversionRate: listingCount > 0 ? 12.5 : 0,
        listingViews: views,
        favorites,
        profileVisits,
        weeklyPerformance: [15000, 22000, 18000, 29000, 31000, 28000, 35000],
        monthlyPerformance: [80000, 95000, 110000, 140000],
        bestListings: listings.slice(0, 3).map((l) => ({
          title: l.title,
          views: 450,
          sales: 5,
          revenue: Number(l.price) * 5,
        })),
        revenueBreakdown: [
          { name: 'Accounts Direct', value: 65 },
          { name: 'Escrow Referrals', value: 25 },
          { name: 'Affiliate Commissions', value: 10 },
        ],
      }
    } catch (err) {
      console.error('Error fetching seller analytics:', err)
      throw err
    }
  },

  async getBuyerAnalytics(buyerId: string) {
    try {
      const { data: ordersRaw } = await supabase
        .from('orders')
        .select('*')
        .eq('buyer_id', buyerId)
      const orders = ordersRaw || []

      const purchases = orders.length
      const spending = orders.reduce((sum, o) => sum + Number(o.amount), 0)
      const successRate =
        purchases > 0
          ? (orders.filter((o) => o.status === 'completed').length /
              purchases) *
            100
          : 100

      return {
        purchases,
        spending,
        successRate,
        favoritePlatforms: [
          { name: 'Upwork', value: 50 },
          { name: 'Fiverr', value: 30 },
          { name: 'Toptal', value: 20 },
        ],
        monthlySpending: [45000, 60000, 30000, spending],
        savedListingsCount: 8,
      }
    } catch (err) {
      console.error('Error fetching buyer analytics:', err)
      throw err
    }
  },
}
