-- Cleanup duplicate support conversations

WITH support_participants AS (
  SELECT 
    cp.conversation_id,
    cp.user_id AS customer_id
  FROM conversation_participants_v2 cp
  JOIN profiles p ON p.id = cp.user_id
  JOIN conversations_v2 c ON c.id = cp.conversation_id
  WHERE c.type = 'support' AND p.role != 'admin'
),
conv_stats AS (
  SELECT 
    c.id AS conversation_id,
    c.created_at,
    c.updated_at,
    MAX(m.created_at) AS latest_message_at
  FROM conversations_v2 c
  LEFT JOIN messages_v2 m ON m.conversation_id = c.id
  WHERE c.type = 'support'
  GROUP BY c.id, c.created_at, c.updated_at
),
ranked_convs AS (
  SELECT 
    sp.customer_id,
    cs.conversation_id,
    ROW_NUMBER() OVER(
      PARTITION BY sp.customer_id 
      ORDER BY 
        COALESCE(cs.latest_message_at, '1970-01-01'::timestamptz) DESC, 
        cs.updated_at DESC, 
        cs.created_at DESC
    ) as rnk
  FROM support_participants sp
  JOIN conv_stats cs ON cs.conversation_id = sp.conversation_id
),
duplicates AS (
  SELECT conversation_id, customer_id
  FROM ranked_convs
  WHERE rnk > 1
),
canonicals AS (
  SELECT conversation_id, customer_id
  FROM ranked_convs
  WHERE rnk = 1
),
update_messages AS (
  UPDATE messages_v2 m
  SET conversation_id = c.conversation_id
  FROM duplicates d
  JOIN canonicals c ON c.customer_id = d.customer_id
  WHERE m.conversation_id = d.conversation_id
  RETURNING m.id
)
UPDATE conversations_v2 cv
SET is_archived = true
FROM duplicates d
WHERE cv.id = d.conversation_id;
