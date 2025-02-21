
CREATE OR REPLACE FUNCTION update_payment_method(
  user_id UUID,
  payment_method TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET payment_method = payment_method::jsonb
  WHERE id = user_id;
END;
$$;
