
CREATE OR REPLACE FUNCTION public.get_total_coins()
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  total_coins INT;
BEGIN
  SELECT COALESCE(SUM(coins), 0) INTO total_coins
  FROM user_stats;
  
  RETURN total_coins;
END;
$function$
