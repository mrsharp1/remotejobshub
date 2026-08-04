export const DEFAULT_CURRENCY = 'NGN'

export const formatCurrency = (amount: number | string, options?: Intl.NumberFormatOptions): string => {
  const numericValue = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(numericValue)) {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', ...options }).format(0)
  }
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', ...options }).format(numericValue)
}
