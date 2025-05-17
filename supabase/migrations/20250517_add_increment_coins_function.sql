
-- Function to increment a user's coins
CREATE OR REPLACE FUNCTION increment_coins(user_id_input UUID, amount INT)
RETURNS SETOF user_stats
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  UPDATE user_stats
  SET coins = coins + amount
  WHERE user_id = user_id_input
  RETURNING *;
END;
$$;

-- Function to get a user's current coin count
CREATE OR REPLACE FUNCTION get_coins(user_id_input UUID)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  coin_count INT;
BEGIN
  SELECT coins INTO coin_count
  FROM user_stats
  WHERE user_id = user_id_input;
  
  RETURN COALESCE(coin_count, 0);
END;
$$;
