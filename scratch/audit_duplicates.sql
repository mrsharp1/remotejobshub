WITH support_participants AS (
  -- Get all customers (non-admins) in support conversations
  SELECT 
    cp.conversation_id,
    cp.user_id AS customer_id,
    p.full_name,
    p.email
  FROM conversation_participants_v2 cp
  JOIN profiles p ON p.id = cp.user_id
  JOIN conversations_v2 c ON c.id = cp.conversation_id
  WHERE c.type = 'support' AND p.role != 'admin'
),
conv_stats AS (
  -- Get message and attachment counts per conversation
  SELECT 
    c.id AS conversation_id,
    c.created_at,
    c.updated_at,
    c.is_archived,
    COUNT(m.id) AS message_count,
    MAX(m.created_at) AS latest_message_at,
    SUM(CASE WHEN a.id IS NOT NULL THEN 1 ELSE 0 END) AS attachment_count
  FROM conversations_v2 c
  LEFT JOIN messages_v2 m ON m.conversation_id = c.id
  LEFT JOIN message_attachments_v2 a ON a.message_id = m.id
  WHERE c.type = 'support'
  GROUP BY c.id, c.created_at, c.updated_at, c.is_archived
),
combined AS (
  SELECT 
    sp.customer_id,
    COALESCE(sp.full_name, sp.email, 'Unknown') AS customer_name,
    cs.conversation_id,
    cs.created_at,
    cs.updated_at,
    cs.is_archived,
    cs.message_count,
    cs.latest_message_at,
    cs.attachment_count,
    ROW_NUMBER() OVER(
      PARTITION BY sp.customer_id 
      ORDER BY 
        COALESCE(cs.latest_message_at, '1970-01-01'::timestamptz) DESC, 
        cs.updated_at DESC, 
        cs.created_at DESC
    ) as rnk,
    COUNT(*) OVER(PARTITION BY sp.customer_id) as total_convs
  FROM support_participants sp
  JOIN conv_stats cs ON cs.conversation_id = sp.conversation_id
)
SELECT 
  customer_id,
  customer_name,
  conversation_id,
  CASE WHEN rnk = 1 THEN 'CANONICAL' ELSE 'DUPLICATE' END as classification,
  message_count,
  latest_message_at,
  attachment_count,
  created_at,
  updated_at,
  total_convs
FROM combined
WHERE total_convs > 1
ORDER BY customer_name ASC, rnk ASC;
