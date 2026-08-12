-- Migration: Add residential_address to seller_verifications

-- Add the residential_address column
ALTER TABLE public.seller_verifications
ADD COLUMN residential_address TEXT;

-- No NOT NULL constraint is added to ensure backward compatibility with any historical records that lack this field.
