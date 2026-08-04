-- 20260726000001_fix_order_status_constraint.sql
-- P2 FIX: Add 'payment_pending' status to orders table CHECK constraint.
-- The code uses this status extensively but it was missing from the DB constraint,
-- causing any order update to 'payment_pending' to throw a CHECK violation error.

ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;

ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
  CHECK (status IN (
    'pending',
    'payment_pending',
    'payment_received',
    'seller_processing',
    'buyer_review',
    'completed',
    'cancelled',
    'disputed'
  ));
