
const run = async () => {
  const res = await fetch('https://pgcxvpdohwhcvseloxpi.supabase.co/functions/v1/paystack-init', {
    method: 'POST',
    headers: { Authorization: 'Bearer sb_publishable_z5hmxvzq8npw7lDUiwjoYg_ZJeIKf-L', 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 5000 })
  })
  console.log('STATUS:', res.status)
  console.log('TEXT:', await res.text())
}
run()

