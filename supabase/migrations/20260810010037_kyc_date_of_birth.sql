-- Add date_of_birth to seller_verifications for KYC
ALTER TABLE public.seller_verifications 
ADD COLUMN IF NOT EXISTS date_of_birth TEXT;

-- No NOT NULL constraint because historical records may not have it
