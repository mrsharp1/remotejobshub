-- Migration: 005_orders.sql
-- Create orders, order_timeline, and order_messages tables for escrow purchase foundation

-- Create status enum values using TEXT and check constraints for maximum flexibility
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  seller_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'pending',
  amount NUMERIC NOT NULL CHECK (amount >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  CONSTRAINT check_order_status CHECK (
    status IN (
      'pending',
      'payment_pending',
      'payment_received',
      'seller_processing',
      'buyer_review',
      'completed',
      'cancelled',
      'disputed'
    )
  )
);

-- Indexing for quick lookups
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_listing ON public.orders(listing_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);

-- Order Timeline Table
CREATE TABLE IF NOT EXISTS public.order_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_timeline_order ON public.order_timeline(order_id);

-- Order Messages Table
CREATE TABLE IF NOT EXISTS public.order_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_messages_order ON public.order_messages(order_id);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Orders
DROP POLICY IF EXISTS "Users can read their own orders" ON public.orders;
CREATE POLICY "Users can read their own orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = buyer_id OR auth.uid() = seller_id
  );

DROP POLICY IF EXISTS "Buyers can create orders" ON public.orders;
CREATE POLICY "Buyers can create orders" ON public.orders
  FOR INSERT WITH CHECK (
    auth.uid() = buyer_id
  );

DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;
CREATE POLICY "Users can update their own orders" ON public.orders
  FOR UPDATE USING (
    auth.uid() = buyer_id OR auth.uid() = seller_id
  );

-- RLS Policies for Order Timeline
DROP POLICY IF EXISTS "Users can read timeline of their orders" ON public.order_timeline;
CREATE POLICY "Users can read timeline of their orders" ON public.order_timeline
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_timeline.order_id
      AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert timeline items" ON public.order_timeline;
CREATE POLICY "Users can insert timeline items" ON public.order_timeline
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_timeline.order_id
      AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
  );

-- RLS Policies for Order Messages
DROP POLICY IF EXISTS "Users can read messages of their orders" ON public.order_messages;
CREATE POLICY "Users can read messages of their orders" ON public.order_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_messages.order_id
      AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can insert messages to their orders" ON public.order_messages;
CREATE POLICY "Users can insert messages to their orders" ON public.order_messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_messages.order_id
      AND (orders.buyer_id = auth.uid() OR orders.seller_id = auth.uid())
    )
  );

-- Trigger for updated_at column
CREATE OR REPLACE TRIGGER trigger_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
