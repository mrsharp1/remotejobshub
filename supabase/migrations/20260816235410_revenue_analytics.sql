CREATE OR REPLACE FUNCTION rpc_get_revenue_analytics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result json;
  v_daily json;
  v_weekly json;
  v_monthly json;
  v_yearly json;
  v_aov numeric;
  v_success_rate numeric;
  v_disputed_rate numeric;
  v_commission numeric;
BEGIN
  -- Daily (last 24 hours, grouped by hour)
  SELECT COALESCE(json_agg(json_build_object(
    'label', to_char(date_trunc('hour', created_at), 'HH24:00'),
    'value', amount
  )), '[]'::json) INTO v_daily
  FROM (
    SELECT date_trunc('hour', created_at) as created_at, SUM(amount) as amount
    FROM payments
    WHERE created_at >= NOW() - INTERVAL '24 hours'
    AND payment_status IN ('success', 'released')
    GROUP BY date_trunc('hour', created_at)
    ORDER BY date_trunc('hour', created_at)
  ) d;

  -- Weekly (last 7 days, grouped by day name)
  SELECT COALESCE(json_agg(json_build_object(
    'label', to_char(date_trunc('day', created_at), 'Dy'),
    'value', amount
  )), '[]'::json) INTO v_weekly
  FROM (
    SELECT date_trunc('day', created_at) as created_at, SUM(amount) as amount
    FROM payments
    WHERE created_at >= NOW() - INTERVAL '7 days'
    AND payment_status IN ('success', 'released')
    GROUP BY date_trunc('day', created_at)
    ORDER BY date_trunc('day', created_at)
  ) w;

  -- Monthly (this year, grouped by month)
  SELECT COALESCE(json_agg(json_build_object(
    'label', to_char(date_trunc('month', created_at), 'Mon'),
    'value', amount
  )), '[]'::json) INTO v_monthly
  FROM (
    SELECT date_trunc('month', created_at) as created_at, SUM(amount) as amount
    FROM payments
    WHERE created_at >= date_trunc('year', NOW())
    AND payment_status IN ('success', 'released')
    GROUP BY date_trunc('month', created_at)
    ORDER BY date_trunc('month', created_at)
  ) m;

  -- Yearly (last 5 years)
  SELECT COALESCE(json_agg(json_build_object(
    'label', to_char(date_trunc('year', created_at), 'YYYY'),
    'value', amount
  )), '[]'::json) INTO v_yearly
  FROM (
    SELECT date_trunc('year', created_at) as created_at, SUM(amount) as amount
    FROM payments
    WHERE created_at >= NOW() - INTERVAL '5 years'
    AND payment_status IN ('success', 'released')
    GROUP BY date_trunc('year', created_at)
    ORDER BY date_trunc('year', created_at)
  ) y;

  -- Global Stats
  SELECT 
    COALESCE(AVG(amount), 0),
    COALESCE(SUM(amount) * 0.10, 0),
    CASE WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE payment_status IN ('success', 'released'))::numeric / COUNT(*)::numeric) * 100 ELSE 0 END,
    CASE WHEN COUNT(*) > 0 THEN (COUNT(*) FILTER (WHERE payment_status = 'refunded')::numeric / COUNT(*)::numeric) * 100 ELSE 0 END
  INTO 
    v_aov, 
    v_commission,
    v_success_rate,
    v_disputed_rate
  FROM payments;

  v_result := json_build_object(
    'daily', v_daily,
    'weekly', v_weekly,
    'monthly', v_monthly,
    'yearly', v_yearly,
    'stats', json_build_object(
      'average_order_value', v_aov,
      'total_commission', v_commission,
      'success_rate', v_success_rate,
      'disputed_rate', v_disputed_rate
    )
  );

  RETURN v_result;
END;
$$;
