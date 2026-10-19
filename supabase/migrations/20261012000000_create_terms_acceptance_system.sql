-- 20261012000000_create_terms_acceptance_system.sql
-- Terms & Conditions Versioning, Clickwrap Acceptance & Evidence Ledger

-- 1. Table: terms_documents
-- Stores canonical published and historical versions of the platform terms
CREATE TABLE IF NOT EXISTS public.terms_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    version text NOT NULL UNIQUE,
    title text NOT NULL,
    document_hash text NOT NULL,
    content text NOT NULL,
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    effective_at timestamptz NOT NULL DEFAULT now(),
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Seed canonical terms baseline document (Status 'draft' pending client approval)
INSERT INTO public.terms_documents (
    version,
    title,
    document_hash,
    content,
    status,
    effective_at
) VALUES (
    '2026-04-v1.0',
    'Remote Jobs Hub Terms and Conditions',
    'b7bd68bd6144eec5b791ce9c9c714809dc8a3dd42d89334dee4bbc9efd8ccd35',
    'TITLE: Remote Jobs Hub Terms and Conditions

VERSION: 2026-04-v1.0

LAST_UPDATED: April 2026

PREAMBLE: By accessing this page, communicating with the service provider, or making any form of payment, you ("Client") confirm that you have read, understood, and agreed to be legally bound by the following Terms and Conditions.

SECTION: DEFINITIONS

CONTENT: For the purpose of these Terms:

BULLETS: “Service Provider” refers to the individual or entity offering guidance and mentorship services. | “Client” refers to any person who engages, pays for, or uses the service. | “Services” refers to all guidance, mentorship, setup assistance, and information provided regarding remote job opportunities.

SECTION: NATURE OF SERVICE

CONTENT: The Service Provider offers educational guidance, mentorship, and setup assistance relating to remote AI-based job opportunities.
This service may include support across up to three (3) different remote job platforms, depending on availability, eligibility, and regional accessibility.
These platforms may include but are not limited to Outlier AI or similar platforms in the remote AI and digital work industry.
The Service Provider is not an employee, agent, or official representative of any third-party platform mentioned.

SECTION: NO EMPLOYMENT OR PARTNERSHIP GUARANTEE

CONTENT: By using this service, the Client acknowledges that:

BULLETS: This service does not guarantee employment with any company or platform | No formal job contract is created between the Client and any platform | The Service Provider does not control hiring decisions or platform approval systems

SECTION: NO GUARANTEE OF SPECIFIC PLATFORM ACCESS

CONTENT: The Client understands and agrees that:
• Access to any specific platform, including Outlier AI UK Account (bonus), is not guaranteed.
• Platform availability may vary based on country or regional restrictions, account verification policies, platform internal decisions, and technical or system limitations.
The Client is paying for guidance, support, and access to available opportunities, not for guaranteed access to any single platform.

SECTION: MULTIPLE OPPORTUNITY STRUCTURE

CONTENT: The service is structured to provide up to three (3) remote job options, depending on eligibility and availability.

BULLETS: If one platform is not accessible, alternative platforms will be provided | Final selection of platform depends on Client eligibility and platform acceptance criteria | The Service Provider reserves the right to modify available options at any time without prior notice

SECTION: FEES AND PAYMENT TERMS

CONTENT: 6.1 Initial Payment:
• A non-refundable fee is required to begin the service.
• This fee covers setup guidance, mentorship and consultation, assistance with account preparation, and general support throughout onboarding.

6.2 Performance-Based Fee:
• This fee is payable only after the Client receives their first successful payout from any platform.
• This fee is considered a performance-based service fee for continued support and mentorship.

SECTION: NO INCOME GUARANTEE

CONTENT: The Client acknowledges that earnings are not guaranteed. Income varies based on individual effort, platform availability, task completion, and platform policies and demand.
The Service Provider does not guarantee any specific income level, continuous availability of tasks, or long-term access to any platform.

SECTION: PLATFORM RULES AND COMPLIANCE

CONTENT: The Client agrees that each platform has its own independent rules and policies, and the Client is responsible for complying with all platform terms of service. The Service Provider is not responsible for platform enforcement actions, account suspension or termination, restrictions imposed by platforms, or changes in platform policies or access conditions.

SECTION: REFUND POLICY

CONTENT: By engaging this service, the Client agrees that the initial payment is strictly non-refundable once you join the community and guidance has commenced, OR any form of service delivery has started.
Refunds will not be issued in cases such as platform rejection or ineligibility, change of mind after payment, failure to follow instructions, or lack of participation or engagement.

SECTION: CLIENT RESPONSIBILITIES

CONTENT: The Client agrees to provide accurate and truthful information, follow all instructions provided during onboarding, maintain professionalism during all platform interactions, and take responsibility for their own performance and results. Failure to comply may affect outcomes without liability on the Service Provider.

SECTION: LIMITATION OF LIABILITY

CONTENT: To the fullest extent permitted by law, the Service Provider shall not be held responsible for loss of income or expected earnings, platform errors, delays, or restrictions, technical issues beyond reasonable control, decisions made by third-party platforms, or any indirect or consequential losses.

SECTION: NO LEGAL OR EMPLOYMENT RELATIONSHIP

CONTENT: Nothing in this agreement shall be interpreted as creating an employment relationship, partnership, agency relationship, or franchise arrangement. The relationship is strictly service-based and independent.

SECTION: ACCEPTANCE OF TERMS

CONTENT: By clicking “Chat Me”, sending a direct message, making any payment, or engaging in onboarding or communication, the Client confirms that they have read and understood these Terms, agree to be legally bound by them, and accept all risks associated with participation.

SECTION: ACCOUNT AVAILABILITY AND DELIVERY

CONTENT: The Client acknowledges that account listings displayed as “Available,” “In Stock,” or “For Sale” indicate that the Service Provider is currently accepting orders for that account type. Such listings do not constitute a guarantee of immediate delivery.
Due to inventory management, quality checks, account verification, order volume, platform policies, or other operational requirements, delivery may be delayed.
The Service Provider reserves the right to allocate, replace, delay, or provide an equivalent account or an alternative remote job opportunity where necessary.
Estimated delivery times are provided for guidance only and are not guaranteed.

SECTION: ORDER FULFILMENT

CONTENT: Purchasing an account does not guarantee immediate delivery or immediate onboarding. Orders are processed according to account availability, verification requirements, platform eligibility, inventory levels, and operational capacity.
The Client agrees that reasonable waiting or processing periods do not constitute a breach of this agreement and do not entitle the Client to a refund.

SECTION: PAYMENT RELEASE

CONTENT: For security purposes, payments made through the marketplace are initially held by the platform and are not immediately released to the Service Provider.
The “Release Funds” button authorizes the platform to release the seller’s payment. By clicking “Release Funds,” the Client confirms that they authorize the platform to pay the Service Provider.
The Client understands and agrees that releasing the funds does not mean they are entitled to an immediate account, immediate onboarding, or immediate placement into an account creation batch. Account allocation and onboarding are subject to availability, verification, eligibility, and processing requirements.
Accordingly, the release of funds does not create any right to a refund merely because an account has not yet been delivered immediately or because the Client has not yet been added to an account creation batch.
Once funds have been released to the Service Provider, the payment becomes final and non-refundable, except where required by applicable law.

SECTION: COMMUNICATION POLICY

CONTENT: The Client agrees to communicate respectfully and professionally at all times. Any form of abusive language, insults, threats, harassment, intimidation, or offensive conduct directed at the Service Provider or members of the community may result in the immediate suspension or permanent termination of the Client’s access to the service, community, or future services, without refund where services have already commenced.

SECTION: AGREEMENT AND ELECTRONIC ACCEPTANCE

CONTENT: By clicking “I Agree,” “Chat Me,” “Purchase,” “Proceed,” making payment, releasing funds, or continuing to use the Service, the Client confirms that they:
• Have carefully read and fully understood these Terms and Conditions;
• Voluntarily agree to be legally bound by all provisions contained herein;
• Accept all risks associated with participating in remote work opportunities;
• Acknowledge that their electronic acceptance constitutes a legally binding agreement and has the same legal effect as a handwritten signature, to the fullest extent permitted by applicable law.

SECTION: PURCHASE NOTICE

CONTENT: If you do not agree with these Terms and Conditions, please do not proceed with payment or use this Service.
By completing your purchase, you acknowledge that you are paying for access to our remote jobs community, educational guidance, mentorship, setup assistance, and available remote work opportunities.
You further acknowledge that:
• You are not purchasing guaranteed employment.
• You are not purchasing a guaranteed Outlier AI account.
• You are not purchasing guaranteed income.
• Immediate account delivery is not guaranteed.
• Alternative remote job opportunities may be provided where a specific account is unavailable, subject to eligibility and availability.
• The initial payment is non-refundable once service delivery has commenced, except where required by applicable law.',
    'draft',
    now()
)
ON CONFLICT (version) DO NOTHING;

-- Seed client-supplied canonical terms document v2.0 (Status 'draft' pending client publication approval)
INSERT INTO public.terms_documents (
    version,
    title,
    document_hash,
    content,
    status,
    effective_at
) VALUES (
    '2026-04-v2.0',
    'Remote Jobs Hub Terms and Conditions',
    'c0a159f51cba332bab9f1ac335f674707973a125467fb50702eaf57ac31b2da8',
    'TITLE: Remote Jobs Hub Terms and Conditions

VERSION: 2026-04-v2.0

LAST_UPDATED: April 2026

PREAMBLE: By accessing this page, clicking the “Chat Me” button, communicating with the Service Provider or a Vendor, making any payment, or joining the community, you (“Client”) confirm that you have read, understood, and agreed to these Terms and Conditions.

SECTION: 1. 📌 DEFINITIONS

CONTENT: For the purpose of these Terms:

BULLETS: “Service Provider” refers to the individual or entity providing guidance, mentorship, support, community access, or related services. | “Client” refers to any person who engages with, pays for, or uses the services. | “Vendor” refers to an individual or third party who lists or offers an account or opportunity through the website/community. | “Services” refers to guidance, mentorship, setup assistance, community access, account-related information, and information regarding remote job opportunities. | “Listed Account” refers to an account or account opportunity advertised or listed on the website by a Vendor.

SECTION: 2. 📌 NATURE OF SERVICE

CONTENT: The Service Provider offers educational guidance, mentorship, community access, and setup assistance relating to remote AI-based job opportunities.

This service may include support across up to three (3) different remote job platforms, depending on availability, eligibility, and regional accessibility.

These platforms may include, but are not limited to, Outlier AI or similar platforms in the remote AI and digital work industry.

The Service Provider is not an employee, agent, or official representative of any third-party platform mentioned.

SECTION: 3. ⚠️ NO EMPLOYMENT OR PARTNERSHIP GUARANTEE

CONTENT: By using this service, the Client acknowledges that:

BULLETS: The service does not guarantee employment with any company or platform. | No formal employment contract is created between the Client and any platform. | The Service Provider does not control hiring decisions, account approvals, or platform acceptance systems.

FOOTER: All platform decisions remain solely with the respective companies.

SECTION: 4. ⚠️ NO GUARANTEE OF SPECIFIC PLATFORM ACCESS

CONTENT: The Client understands and agrees that:

BULLETS: Access to any specific platform or account is not guaranteed. | Platform availability may vary based on: | Country or regional restrictions | Account verification policies | Platform internal decisions | Technical or system limitations | Availability of suitable accounts or opportunities

FOOTER: The Client is paying for guidance, support, community access, and available opportunities, and not for guaranteed access to any particular platform or account unless expressly stated otherwise.

SECTION: 5. 💼 MULTIPLE OPPORTUNITY STRUCTURE

CONTENT: The service may provide access to up to three (3) remote job opportunities or platforms, depending on eligibility and availability.

BULLETS: If one platform is not accessible, alternative opportunities may be provided where available. | Final platform access depends on eligibility and applicable platform requirements. | Available opportunities may change at any time. | The Service Provider reserves the right to modify available options without prior notice.

SECTION: 6. 🏷️ ACCOUNT LISTINGS, VENDORS & AVAILABILITY

CONTENT: Some accounts or opportunities displayed on the website may be listed by Vendors.

A Client understands and agrees that:

BULLETS: A Vendor may list an account or account opportunity that is not currently available for immediate delivery. | In such cases, the Vendor may need to source, obtain, or arrange the relevant account or opportunity for the Client after payment. | The fact that an account is listed on the website does not necessarily mean that the account is immediately available at the exact time of purchase. | Estimated availability may depend on the Vendor’s ability to source or arrange the account. | The Client understands that sourcing or arranging an account may take additional time. | The Service Provider and/or Vendor does not guarantee a specific delivery timeframe unless a timeframe has been expressly communicated and agreed upon.

SUBSECTION: 6.1 Account Information

SUBCONTENT: Where the Client pays for a listed account or account opportunity, the Client may receive information regarding the current status of the account.

For clarity, the term “account information” or “info” does not automatically mean account login details, passwords, email addresses, authentication codes, or other credentials.

“Account information” may refer to information such as:

SUBBULLETS: Current account status | Whether the account is active or inactive | Current availability/status of the opportunity | Relevant account-related conditions | Other non-credential information communicated by the Vendor

SUBFOOTER: Login credentials or other sensitive account information will only be provided where expressly included in the specific listing or arrangement.

SUBSECTION: 6.2 Vendor-Managed Access

SUBCONTENT: Where a Vendor offers access to an account or opportunity, the Vendor may add or grant the Client access to the relevant set, group, workspace, or other designated arrangement after payment for the listed account has been completed.

The exact method of access may vary depending on the Vendor and the nature of the opportunity.

SECTION: 7. 💰 FEES AND PAYMENT TERMS

SUBSECTION: 7.1 Initial Payment

SUBCONTENT: A non-refundable fee may be required to begin the service.

Depending on the service selected, the fee may cover:

SUBBULLETS: Setup guidance | Mentorship and consultation | Community access | Assistance with account preparation | Account-related information | General support throughout onboarding | Access to available opportunities

SUBSECTION: 7.2 Performance-Based Fee

SUBCONTENT: Where applicable, a performance-based fee may be payable after the Client receives their first successful payout from a platform.

Such a fee is considered a service fee for continued support and mentorship and will only apply where expressly communicated to and accepted by the Client.

SECTION: 8. 🚫 NO INCOME GUARANTEE

CONTENT: The Client acknowledges that:

BULLETS: Earnings are not guaranteed. | Income varies based on individual effort, platform availability, task completion, platform policies, demand, and other external factors.

SUBCONTENT: The Service Provider does not guarantee:

SUBBULLETS: Any specific income level | Continuous availability of tasks | Long-term access to any platform | A specific number of tasks | A specific payout amount

SECTION: 9. 🌍 PLATFORM RULES AND COMPLIANCE

CONTENT: The Client acknowledges that each platform has its own independent rules, policies, eligibility requirements, and terms of service.

The Client is responsible for complying with all applicable platform rules.

The Service Provider and Vendors are not responsible for:

BULLETS: Delays | Account suspension or termination | Platform restrictions | Changes in platform policies | Changes in eligibility requirements | Changes in access conditions | Decisions made independently by third-party platforms

SECTION: 10. 📉 REFUND POLICY

CONTENT: By engaging with the service, the Client agrees that payments are non-refundable once:

BULLETS: The Client has joined the community; | Guidance or mentorship has commenced; | Account-related services have commenced; | An opportunity has been sourced or arranged on the Client’s behalf; or | Any other form of service delivery has started.

SUBCONTENT: Refunds will generally not be issued because of:

SUBBULLETS: Platform rejection or ineligibility | Change of mind after payment | Failure to follow instructions | Lack of participation or engagement | Platform restrictions or policy changes | Delays caused by third parties | Unavailability of tasks or work | Failure to generate expected income

FOOTER: Where a Vendor has separate terms for a specific account listing, those terms may also apply.

SECTION: 11. 🤝 CLIENT RESPONSIBILITIES

CONTENT: The Client agrees to:

BULLETS: Provide accurate and truthful information. | Follow instructions provided during onboarding. | Maintain professionalism when communicating with platforms, Vendors, and the Service Provider. | Take responsibility for their own performance and results. | Review and understand the terms and requirements of any third-party platform they use.

FOOTER: Failure to comply may affect the Client’s results without liability on the Service Provider.

SECTION: 12. 🔒 LIMITATION OF LIABILITY

CONTENT: To the fullest extent permitted by applicable law, the Service Provider shall not be held responsible for:

BULLETS: Loss of income or expected earnings | Platform errors or delays | Platform restrictions or account actions | Technical issues beyond reasonable control | Decisions made by third-party platforms | Vendor-related delays or availability issues | Changes in platform policies | Indirect or consequential losses

SECTION: 13. 🔐 NO LEGAL OR EMPLOYMENT RELATIONSHIP

CONTENT: Nothing in these Terms shall be interpreted as creating:

BULLETS: An employment relationship | A partnership | An agency relationship | A franchise or franchise-like arrangement

FOOTER: The relationship is strictly service-based and independent.

SECTION: 14. 📢 ACCEPTANCE OF TERMS

CONTENT: By any of the following actions:

BULLETS: Clicking “Chat Me” | Sending a direct message | Making any payment | Joining the community | Purchasing or requesting a listed account | Engaging in onboarding or communication

SUBCONTENT: the Client confirms that they:

SUBBULLETS: Have read and understood these Terms. | Agree to be bound by these Terms. | Understand that availability of platforms, accounts, tasks, and opportunities may change. | Accept the risks associated with participating in remote earning opportunities.

SECTION: 15. ⚠️ FINAL DISCLAIMER

CONTENT: This service is designed to provide educational guidance, support, community access, and information relating to remote earning opportunities.

It does not guarantee:

BULLETS: Access to any specific platform | Access to any specific account | Employment | Income | A specific payout | Continuous work | Long-term account availability | Any particular result

FOOTER: Platform access and account availability may depend on third-party decisions, eligibility requirements, regional restrictions, Vendor availability, and other factors outside the Service Provider’s control.

SECTION: 16. ✅ CLIENT ACKNOWLEDGEMENT

CONTENT: By making a payment or joining the community, I acknowledge that I understand that I am paying for access to a remote job community, guidance, support, and/or an available opportunity.

I understand that payment does not automatically guarantee access to a specific platform, a specific account, employment, income, or results.

I also understand that some accounts listed by Vendors may not be immediately available and that a Vendor may need to source or arrange the account after payment.

I understand that “account info” refers to the current status or other non-credential information about an account unless the specific listing expressly states otherwise.

SECTION: ⚠️ IMPORTANT — TERMS ACCEPTANCE & CONTRACT NOTICE

CONTENT: PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE MAKING ANY PAYMENT OR USING OUR SERVICES.

These Terms and Conditions constitute a binding agreement between you (“Client”) and the Service Provider/Brand. By making a payment, joining the community, communicating with the Service Provider or a Vendor regarding a service, or otherwise proceeding with an order, you acknowledge that you have had the opportunity to read these Terms and Conditions and that you accept and agree to be bound by them.

SECTION: 🚨 DO NOT MAKE PAYMENT IF YOU DO NOT AGREE

CONTENT: Do not make any payment if you do not understand, accept, or agree to these Terms and Conditions.

If you have any questions or concerns about the terms, you should raise them before making payment.

By proceeding with payment or using the service, you confirm that you have accepted the terms governing your purchase.

SECTION: ❌ NO REFUNDS

CONTENT: Unless otherwise expressly stated in these Terms or required by applicable law, all payments are final and non-refundable once the applicable service has commenced, access has been provided, an opportunity has been sourced or arranged, or the Client has joined the relevant community/service.

A Client cannot request a refund simply because they did not read, review, understand, or familiarize themselves with these Terms before making payment.
Failure to read these Terms does not invalidate your agreement to them. By proceeding with payment or use of the service, you remain responsible for complying with the Terms you accepted.

SECTION: 📢 PROFESSIONAL COMMUNICATION & CONDUCT

CONTENT: The Client agrees to communicate with the Service Provider, Brand, Vendors, and other members respectfully and professionally.

Harassment, threats, cyberbullying, intimidation, defamation, malicious public accusations, or other abusive conduct relating to a refund request, account issue, service disagreement, or enforcement of these Terms will not be tolerated.

A disagreement regarding a refund or the application of these Terms does not give either party the right to harass, threaten, intimidate, or target another person online.

Where a refund is declined in accordance with these Terms, the Client agrees to use the appropriate communication or dispute-resolution process rather than engaging in harassment, cyberbullying, threats, or malicious conduct.

The Service Provider reserves the right to restrict or terminate a Client’s access to the community or services where the Client engages in abusive, threatening, or harassing conduct, subject to applicable law.

SECTION: ✅ ACKNOWLEDGEMENT

CONTENT: By proceeding with payment, the Client confirms:

“I confirm that I have had the opportunity to read these Terms and Conditions. I understand that they form a binding agreement between me and the Service Provider/Brand. I understand the refund policy and agree to comply with these Terms before making payment.”',
    'draft',
    now()
)
ON CONFLICT (version) DO UPDATE
SET title = EXCLUDED.title,
    document_hash = EXCLUDED.document_hash,
    content = EXCLUDED.content,
    status = 'draft'
WHERE public.terms_documents.status = 'draft';
-- Baseline seed status remains: status = 'draft';

-- 2. Table: terms_acceptance_intents
-- Short-lived server-issued consent challenge tokens bound to authenticated buyer, listing, and terms version
CREATE TABLE IF NOT EXISTS public.terms_acceptance_intents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    terms_version text NOT NULL REFERENCES public.terms_documents(version),
    document_hash text NOT NULL,
    consent_affirmation text NOT NULL,
    client_ip text,
    client_user_agent text,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'consumed', 'expired')),
    created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
    expires_at timestamptz NOT NULL DEFAULT (clock_timestamp() + interval '10 minutes')
);

CREATE INDEX IF NOT EXISTS idx_terms_intents_buyer ON public.terms_acceptance_intents(buyer_id, status);
CREATE INDEX IF NOT EXISTS idx_terms_intents_listing ON public.terms_acceptance_intents(listing_id);

-- 3. Table: terms_acceptances
-- Immutable legal audit log recording buyer clickwrap acceptance at checkout
-- NOTE: Foreign keys use ON DELETE RESTRICT to guarantee legal proof cannot be erased if orders/listings/users are deleted
CREATE TABLE IF NOT EXISTS public.terms_acceptances (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    acceptance_reference text NOT NULL UNIQUE,
    buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE RESTRICT,
    listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE RESTRICT,
    consent_intent_id uuid REFERENCES public.terms_acceptance_intents(id) ON DELETE RESTRICT,
    terms_version text NOT NULL REFERENCES public.terms_documents(version),
    document_hash text NOT NULL,
    accepted_at timestamptz NOT NULL DEFAULT clock_timestamp(),
    ip_address text,
    user_agent text,
    checkout_reference text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

-- Indexes for terms_acceptances
CREATE INDEX IF NOT EXISTS idx_terms_acceptances_buyer_id ON public.terms_acceptances(buyer_id);
CREATE INDEX IF NOT EXISTS idx_terms_acceptances_order_id ON public.terms_acceptances(order_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_terms_acceptances_order_id_unique ON public.terms_acceptances(order_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_terms_acceptances_intent_id_unique ON public.terms_acceptances(consent_intent_id);
CREATE INDEX IF NOT EXISTS idx_terms_acceptances_listing_id ON public.terms_acceptances(listing_id);
CREATE INDEX IF NOT EXISTS idx_terms_acceptances_checkout_ref ON public.terms_acceptances(checkout_reference);

-- 4. Database-level immutability enforcement
CREATE OR REPLACE FUNCTION public.prevent_terms_acceptance_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    RAISE EXCEPTION 'terms_acceptances records are immutable evidence and cannot be updated or deleted.';
END;
$$;

DROP TRIGGER IF EXISTS trg_immutable_terms_acceptances ON public.terms_acceptances;
CREATE TRIGGER trg_immutable_terms_acceptances
BEFORE UPDATE OR DELETE ON public.terms_acceptances
FOR EACH ROW EXECUTE FUNCTION public.prevent_terms_acceptance_mutation();

CREATE OR REPLACE FUNCTION public.prevent_accepted_terms_document_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        IF EXISTS (SELECT 1 FROM public.terms_acceptances WHERE terms_version = OLD.version) THEN
            RAISE EXCEPTION 'Cannot delete a terms_documents version that has recorded acceptances.';
        END IF;
        RETURN OLD;
    END IF;

    IF TG_OP = 'UPDATE' THEN
        IF (NEW.version != OLD.version OR NEW.content != OLD.content OR NEW.document_hash != OLD.document_hash)
           AND EXISTS (SELECT 1 FROM public.terms_acceptances WHERE terms_version = OLD.version) THEN
            RAISE EXCEPTION 'Cannot modify version, content, or document_hash of a terms_documents record that has recorded acceptances.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_accepted_terms_documents ON public.terms_documents;
CREATE TRIGGER trg_protect_accepted_terms_documents
BEFORE UPDATE OR DELETE ON public.terms_documents
FOR EACH ROW EXECUTE FUNCTION public.prevent_accepted_terms_document_mutation();

-- Ensure admin helper function is present and search_path-hardened
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$;

-- 5. Row Level Security Policies
ALTER TABLE public.terms_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms_acceptance_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.terms_acceptances ENABLE ROW LEVEL SECURITY;

-- Terms documents read policies
DROP POLICY IF EXISTS "Anyone can view published terms documents" ON public.terms_documents;
DROP POLICY IF EXISTS "Anyone can view published or accepted terms documents" ON public.terms_documents;
CREATE POLICY "Anyone can view published or accepted terms documents"
    ON public.terms_documents FOR SELECT
    USING (
        status = 'published'
        OR EXISTS (
            SELECT 1 FROM public.terms_acceptances ta
            WHERE ta.terms_version = public.terms_documents.version
              AND ta.buyer_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Admins can view all terms documents" ON public.terms_documents;
CREATE POLICY "Admins can view all terms documents"
    ON public.terms_documents FOR SELECT
    USING (public.is_admin());

-- Terms acceptance intents policies
DROP POLICY IF EXISTS "Buyers can view their own acceptance intents" ON public.terms_acceptance_intents;
CREATE POLICY "Buyers can view their own acceptance intents"
    ON public.terms_acceptance_intents FOR SELECT
    USING (auth.uid() = buyer_id);

-- Terms acceptances read policies
DROP POLICY IF EXISTS "Buyers can view their own terms acceptances" ON public.terms_acceptances;
CREATE POLICY "Buyers can view their own terms acceptances"
    ON public.terms_acceptances FOR SELECT
    USING (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Admins can view all terms acceptances" ON public.terms_acceptances;
CREATE POLICY "Admins can view all terms acceptances"
    ON public.terms_acceptances FOR SELECT
    USING (public.is_admin());

-- Revoke write privileges on audit tables
REVOKE INSERT, UPDATE, DELETE ON public.terms_acceptances FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.terms_documents FROM PUBLIC, anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.terms_acceptance_intents FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.terms_documents TO authenticated, anon;
GRANT SELECT ON public.terms_acceptances TO authenticated;
GRANT SELECT ON public.terms_acceptance_intents TO authenticated;

-- 6. RPC: rpc_prepare_checkout_terms_acceptance
-- Generates a cryptographically bound, short-lived server consent challenge token
CREATE OR REPLACE FUNCTION public.rpc_prepare_checkout_terms_acceptance(
    p_listing_id uuid,
    p_terms_version text,
    p_document_hash text,
    p_consent_affirmation text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_buyer_id uuid;
    v_listing record;
    v_terms_doc record;
    v_intent_id uuid;
    v_client_ip text;
    v_client_ua text;
    v_headers jsonb;
BEGIN
    -- 1. Authentication
    v_buyer_id := auth.uid();
    IF v_buyer_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 2. Affirmation requirement (Enforce exact affirmative statement, reject arbitrary strings)
    IF p_consent_affirmation IS NULL OR trim(p_consent_affirmation) != ('I explicitly accept the Remote Jobs Hub Terms and Conditions version ' || p_terms_version || ' and agree to be legally bound thereby.') THEN
        RAISE EXCEPTION 'Invalid or missing consent affirmation statement.';
    END IF;

    -- 3. Listing verification
    SELECT * INTO v_listing FROM public.listings WHERE id = p_listing_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Listing not found';
    END IF;

    IF v_listing.seller_id = v_buyer_id THEN
        RAISE EXCEPTION 'Cannot purchase your own listing';
    END IF;

    IF v_listing.status != 'published' THEN
        RAISE EXCEPTION 'Listing is no longer available for purchase';
    END IF;

    -- 4. Terms document validation
    SELECT * INTO v_terms_doc FROM public.terms_documents WHERE version = p_terms_version;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid terms version specified: %', p_terms_version;
    END IF;

    IF v_terms_doc.status != 'published' THEN
        RAISE EXCEPTION 'The specified terms version is not currently active: %', p_terms_version;
    END IF;

    IF v_terms_doc.document_hash != p_document_hash THEN
        RAISE EXCEPTION 'Terms document hash mismatch. Please refresh and review the updated terms.';
    END IF;

    -- 5. Extract server-observed connection metadata
    BEGIN
        v_headers := current_setting('request.headers', true)::jsonb;
        v_client_ip := coalesce(v_headers ->> 'x-forwarded-for', v_headers ->> 'cf-connecting-ip', 'unknown');
        v_client_ua := coalesce(v_headers ->> 'user-agent', 'unknown');
    EXCEPTION WHEN OTHERS THEN
        v_client_ip := 'unknown';
        v_client_ua := 'unknown';
    END;

    -- 6. Expire any previous pending intents for the same buyer and listing (retry hygiene)
    UPDATE public.terms_acceptance_intents
    SET status = 'expired'
    WHERE buyer_id = v_buyer_id
      AND listing_id = p_listing_id
      AND status = 'pending';

    -- 7. Insert pending acceptance intent
    INSERT INTO public.terms_acceptance_intents (
        buyer_id,
        listing_id,
        terms_version,
        document_hash,
        consent_affirmation,
        client_ip,
        client_user_agent,
        status,
        created_at,
        expires_at
    ) VALUES (
        v_buyer_id,
        p_listing_id,
        p_terms_version,
        p_document_hash,
        p_consent_affirmation,
        v_client_ip,
        v_client_ua,
        'pending',
        clock_timestamp(),
        clock_timestamp() + interval '10 minutes'
    )
    RETURNING id INTO v_intent_id;

    RETURN jsonb_build_object(
        'success', true,
        'acceptance_token', v_intent_id,
        'terms_version', p_terms_version,
        'document_hash', p_document_hash,
        'expires_at', clock_timestamp() + interval '10 minutes'
    );
END;
$$;

REVOKE ALL ON FUNCTION public.rpc_prepare_checkout_terms_acceptance(uuid, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_prepare_checkout_terms_acceptance(uuid, text, text, text) TO authenticated, service_role;

-- 7. Atomic RPC: rpc_checkout_with_wallet (6-argument overload)
-- NOTE: Legacy 1-arg public.rpc_checkout_with_wallet(uuid) is intentionally preserved during rollout
-- so existing browser sessions continue working until the new frontend is deployed and verified.
-- Post-cutover cleanup (execute only after new frontend is live and verified):
-- DROP FUNCTION IF EXISTS public.rpc_checkout_with_wallet(uuid);
DROP FUNCTION IF EXISTS public.rpc_checkout_with_wallet(uuid, text, text, text, text);

CREATE OR REPLACE FUNCTION public.rpc_checkout_with_wallet(
    p_listing_id uuid,
    p_acceptance_token uuid,
    p_terms_version text DEFAULT NULL,
    p_document_hash text DEFAULT NULL,
    p_user_agent text DEFAULT NULL,
    p_ip_address text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_buyer_id uuid;
    v_listing record;
    v_buyer_wallet record;
    v_amount numeric;
    v_fee numeric;
    v_total numeric;
    v_order_id uuid;
    v_payment_id uuid;
    v_reference text;
    v_terms_doc record;
    v_consent record;
    v_acceptance_ref text;
    v_terms_acceptance_id uuid;
    v_accepted_at timestamptz;
BEGIN
    -- 1. Authenticated buyer validation
    v_buyer_id := auth.uid();
    IF v_buyer_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 2. MANDATORY EXPLICIT SERVER-VALIDATED ACCEPTANCE TOKEN VALIDATION
    IF p_acceptance_token IS NULL THEN
        RAISE EXCEPTION 'Explicit terms acceptance token is required to proceed with checkout.';
    END IF;

    -- Lock and validate the server-issued consent intent
    SELECT * INTO v_consent
    FROM public.terms_acceptance_intents
    WHERE id = p_acceptance_token
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid terms acceptance token. Please re-confirm acceptance.';
    END IF;

    -- Verify tenant binding (buyer must match authenticated session)
    IF v_consent.buyer_id != v_buyer_id THEN
        RAISE EXCEPTION 'Terms acceptance token does not belong to the authenticated buyer.';
    END IF;

    -- Verify listing binding
    IF v_consent.listing_id != p_listing_id THEN
        RAISE EXCEPTION 'Terms acceptance token is not valid for this listing.';
    END IF;

    -- Verify token status (replay prevention)
    IF v_consent.status != 'pending' THEN
        RAISE EXCEPTION 'Terms acceptance token has already been consumed or is invalid.';
    END IF;

    -- Verify expiration (stale acceptance prevention)
    IF v_consent.expires_at < clock_timestamp() THEN
        UPDATE public.terms_acceptance_intents SET status = 'expired' WHERE id = v_consent.id;
        RAISE EXCEPTION 'Terms acceptance token has expired. Please re-confirm acceptance.';
    END IF;

    -- Verify document match if parameters provided
    IF p_terms_version IS NOT NULL AND p_terms_version != v_consent.terms_version THEN
        RAISE EXCEPTION 'Submitted terms version does not match acceptance token.';
    END IF;

    IF p_document_hash IS NOT NULL AND p_document_hash != v_consent.document_hash THEN
        RAISE EXCEPTION 'Submitted terms document hash does not match acceptance token.';
    END IF;

    -- Fetch and verify active published terms document from registry
    SELECT * INTO v_terms_doc
    FROM public.terms_documents
    WHERE version = v_consent.terms_version;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid terms version specified: %', v_consent.terms_version;
    END IF;

    IF v_terms_doc.status != 'published' THEN
        RAISE EXCEPTION 'The specified terms version is not currently active: %', v_consent.terms_version;
    END IF;

    IF v_terms_doc.document_hash != v_consent.document_hash THEN
        RAISE EXCEPTION 'Terms document hash mismatch. Please refresh and review the updated terms.';
    END IF;

    -- Mark consent token consumed immediately (atomic replay lock)
    UPDATE public.terms_acceptance_intents
    SET status = 'consumed'
    WHERE id = v_consent.id;

    -- 3. Fetch and validate listing (lock to prevent concurrent race conditions)
    SELECT * INTO v_listing FROM public.listings WHERE id = p_listing_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Listing not found';
    END IF;

    IF v_listing.seller_id = v_buyer_id THEN
        RAISE EXCEPTION 'Cannot purchase your own listing';
    END IF;

    IF v_listing.status != 'published' THEN
        RAISE EXCEPTION 'Listing is no longer available for purchase';
    END IF;

    -- 4. Lock buyer wallet
    SELECT * INTO v_buyer_wallet FROM public.wallets WHERE user_id = v_buyer_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Buyer wallet not found';
    END IF;

    -- 5. Calculate payable amounts (listing price + 5% platform fee matching verified live calculation)
    v_amount := v_listing.price;
    v_fee := ROUND(v_amount * 0.05);
    v_total := v_amount + v_fee;

    -- 6. Verify balance
    IF v_buyer_wallet.available_balance < v_total THEN
        RAISE EXCEPTION 'Insufficient wallet balance. Please fund your wallet.';
    END IF;

    -- 7. Deduct available balance and hold escrow
    UPDATE public.wallets
    SET available_balance = available_balance - v_total,
        escrow_balance = escrow_balance + v_amount,
        updated_at = now()
    WHERE id = v_buyer_wallet.id;

    -- 8. Generate unique payment reference
    v_reference := 'CHK-' || upper(substr(md5(random()::text), 1, 8)) || '-' || extract(epoch from now())::bigint;

    -- 9. Insert wallet ledger transactions
    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (v_buyer_wallet.id, v_buyer_id, 'escrow_hold', -v_amount, 'success', v_reference, 'Funds committed to escrow order');

    INSERT INTO public.wallet_transactions (wallet_id, user_id, type, amount, status, payment_reference, description)
    VALUES (v_buyer_wallet.id, v_buyer_id, 'purchase', -v_fee, 'success', v_reference || '-FEE', 'Buyer platform fee for order processing');

    -- 10. Create marketplace order
    INSERT INTO public.orders (buyer_id, seller_id, listing_id, amount, currency, status)
    VALUES (v_buyer_id, v_listing.seller_id, p_listing_id, v_amount, 'NGN', 'payment_received')
    RETURNING id INTO v_order_id;

    -- 11. Create payment record
    INSERT INTO public.payments (order_id, buyer_id, seller_id, paystack_reference, payment_status, amount, currency, platform_fee, paid_at)
    VALUES (v_order_id, v_buyer_id, v_listing.seller_id, v_reference, 'success', v_amount, 'NGN', v_fee, now())
    RETURNING id INTO v_payment_id;

    -- 12. CREATE IMMUTABLE TERMS ACCEPTANCE EVIDENCE RECORD
    v_acceptance_ref := 'TOS-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 10));
    v_accepted_at := clock_timestamp();

    INSERT INTO public.terms_acceptances (
        acceptance_reference,
        buyer_id,
        order_id,
        listing_id,
        consent_intent_id,
        terms_version,
        document_hash,
        accepted_at,
        ip_address,
        user_agent,
        checkout_reference
    ) VALUES (
        v_acceptance_ref,
        v_buyer_id,
        v_order_id,
        p_listing_id,
        v_consent.id,
        v_consent.terms_version,
        v_consent.document_hash,
        v_accepted_at,
        coalesce(v_consent.client_ip, p_ip_address),
        coalesce(v_consent.client_user_agent, p_user_agent),
        v_reference
    )
    RETURNING id INTO v_terms_acceptance_id;

    -- 13. Create order timeline
    INSERT INTO public.order_timeline (order_id, status, notes)
    VALUES (v_order_id, 'payment_received', 'Wallet checkout completed successfully. Escrow funds secured. Terms accepted (' || v_acceptance_ref || ').');

    -- 14. Ensure exact buyer notification without duplicating tg_new_order_notifications trigger rows
    UPDATE public.notifications
    SET title = 'Escrow Payment Confirmed 💳',
        message = 'Your payment of ₦' || v_amount || ' for order #' || substr(v_order_id::text, 1, 8) || ' was successfully verified and secured in escrow.',
        type = 'payment',
        is_read = false
    WHERE user_id = v_buyer_id
      AND reference_type = 'order'
      AND reference_id = v_order_id;

    IF NOT FOUND THEN
        INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id, is_read)
        VALUES (
            v_buyer_id,
            'Escrow Payment Confirmed 💳',
            'Your payment of ₦' || v_amount || ' for order #' || substr(v_order_id::text, 1, 8) || ' was successfully verified and secured in escrow.',
            'payment',
            'order',
            v_order_id,
            false
        );
    END IF;

    -- 15. Ensure exact seller notification without duplicating tg_new_order_notifications trigger rows
    UPDATE public.notifications
    SET title = 'Payment Secured in Escrow 💳',
        message = 'Buyer has paid ₦' || v_amount || ' for your listing. Funds are secured in escrow. Please deliver credentials.',
        type = 'payment',
        is_read = false
    WHERE user_id = v_listing.seller_id
      AND reference_type = 'order'
      AND reference_id = v_order_id;

    IF NOT FOUND THEN
        INSERT INTO public.notifications (user_id, title, message, type, reference_type, reference_id, is_read)
        VALUES (
            v_listing.seller_id,
            'Payment Secured in Escrow 💳',
            'Buyer has paid ₦' || v_amount || ' for your listing. Funds are secured in escrow. Please deliver credentials.',
            'payment',
            'order',
            v_order_id,
            false
        );
    END IF;

    -- 16. Return complete atomic payload
    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'payment_id', v_payment_id,
        'escrow_id', v_reference,
        'wallet_balance', v_buyer_wallet.available_balance - v_total,
        'terms_acceptance_id', v_terms_acceptance_id,
        'acceptance_reference', v_acceptance_ref,
        'terms_version', v_consent.terms_version,
        'document_hash', v_consent.document_hash,
        'accepted_at', v_accepted_at,
        'message', 'Checkout completed successfully'
    );
END;
$$;

REVOKE ALL ON FUNCTION public.rpc_checkout_with_wallet(uuid, uuid, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_checkout_with_wallet(uuid, uuid, text, text, text, text) TO authenticated, service_role;

-- 8. RPC: rpc_export_terms_acceptances (Admin-Enforced Ledger Export)
CREATE OR REPLACE FUNCTION public.rpc_export_terms_acceptances(
    p_terms_version text DEFAULT NULL,
    p_limit int DEFAULT 1000
)
RETURNS TABLE (
    acceptance_reference text,
    checkout_reference text,
    order_id uuid,
    listing_id uuid,
    buyer_id uuid,
    terms_version text,
    document_hash text,
    accepted_at timestamptz,
    user_agent text,
    ip_address text,
    created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Server-enforced administrator authorization check
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied. Administrator privileges required.';
    END IF;

    RETURN QUERY
    SELECT
        ta.acceptance_reference,
        ta.checkout_reference,
        ta.order_id,
        ta.listing_id,
        ta.buyer_id,
        ta.terms_version,
        ta.document_hash,
        ta.accepted_at,
        ta.user_agent,
        ta.ip_address,
        ta.created_at
    FROM public.terms_acceptances ta
    WHERE (p_terms_version IS NULL OR ta.terms_version = p_terms_version)
    ORDER BY ta.accepted_at DESC
    LIMIT p_limit;
END;
$$;

REVOKE ALL ON FUNCTION public.rpc_export_terms_acceptances(text, int) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_export_terms_acceptances(text, int) TO authenticated, service_role;

-- 9. RPC: rpc_get_terms_acceptance_receipt (Individual Evidence & Historical Document Retrieval)
CREATE OR REPLACE FUNCTION public.rpc_get_terms_acceptance_receipt(
    p_order_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_caller_id uuid;
    v_acceptance public.terms_acceptances%ROWTYPE;
    v_terms_doc public.terms_documents%ROWTYPE;
    v_doc_found boolean := false;
BEGIN
    v_caller_id := auth.uid();
    IF v_caller_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    SELECT * INTO v_acceptance
    FROM public.terms_acceptances
    WHERE order_id = p_order_id;

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    -- Authorization: Only the buyer who accepted or an administrator may access the receipt
    IF v_acceptance.buyer_id != v_caller_id AND NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied. You are not authorized to view this acceptance receipt.';
    END IF;

    SELECT * INTO v_terms_doc
    FROM public.terms_documents
    WHERE version = v_acceptance.terms_version;
    v_doc_found := FOUND;

    RETURN jsonb_build_object(
        'acceptance', jsonb_build_object(
            'id', v_acceptance.id,
            'acceptance_reference', v_acceptance.acceptance_reference,
            'buyer_id', v_acceptance.buyer_id,
            'order_id', v_acceptance.order_id,
            'listing_id', v_acceptance.listing_id,
            'consent_intent_id', v_acceptance.consent_intent_id,
            'terms_version', v_acceptance.terms_version,
            'document_hash', v_acceptance.document_hash,
            'accepted_at', v_acceptance.accepted_at,
            'ip_address', v_acceptance.ip_address,
            'user_agent', v_acceptance.user_agent,
            'checkout_reference', v_acceptance.checkout_reference,
            'created_at', v_acceptance.created_at
        ),
        'document', CASE
            WHEN v_doc_found THEN jsonb_build_object(
                'id', v_terms_doc.id,
                'version', v_terms_doc.version,
                'title', v_terms_doc.title,
                'document_hash', v_terms_doc.document_hash,
                'content', v_terms_doc.content,
                'status', v_terms_doc.status,
                'effective_at', v_terms_doc.effective_at,
                'created_at', v_terms_doc.created_at
            )
            ELSE NULL
        END,
        'hash_verified', (v_doc_found AND v_terms_doc.document_hash = v_acceptance.document_hash)
    );
END;
$$;

REVOKE ALL ON FUNCTION public.rpc_get_terms_acceptance_receipt(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.rpc_get_terms_acceptance_receipt(uuid) TO authenticated, service_role;


