-- Add the vault_data JSONB column
ALTER TABLE public.listings ADD COLUMN vault_data JSONB;

-- Migrate existing contaminated reason_for_sale payloads into vault_data
UPDATE public.listings
SET vault_data = convert_from(decode(substring(reason_for_sale from 22), 'base64'), 'utf8')::jsonb
WHERE reason_for_sale LIKE 'VAULT_SECURE_PAYLOAD:%';

-- Scrub the contaminated payload from reason_for_sale with the neutral fallback
UPDATE public.listings
SET reason_for_sale = 'Account transition / No longer actively using this account.'
WHERE reason_for_sale LIKE 'VAULT_SECURE_PAYLOAD:%';
