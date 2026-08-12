-- 20260808184747_buyer_purchased_listing_access.sql
-- Allow buyers to SELECT listings they have purchased (which may have status = 'sold' and thus not be 'published').

CREATE POLICY "Buyers can select purchased listings" ON public.listings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.listing_id = listings.id
        AND orders.buyer_id = auth.uid()
    )
  );
