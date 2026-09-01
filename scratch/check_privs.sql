SELECT 
    p.proname AS function_name,
    pg_get_userbyid(p.proowner) AS owner,
    p.prosecdef AS is_security_definer,
    COALESCE(
        (
            SELECT string_agg(
                grantee || '=' || string_agg(privilege_type, ','), 
                '; '
            )
            FROM information_schema.routine_privileges rp 
            WHERE rp.routine_name = p.proname 
              AND rp.routine_schema = 'public'
            GROUP BY grantee
        ), 'None/Default'
    ) AS privileges
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN (
    'process_paystack_deposit',
    'rpc_mark_payment_refunded',
    'rpc_mark_payment_released',
    'rpc_process_referral_reward',
    'rpc_admin_resolve_dispute',
    'rpc_release_escrow',
    'rpc_create_dispute',
    'rpc_checkout_with_wallet',
    'rpc_request_withdrawal'
);
