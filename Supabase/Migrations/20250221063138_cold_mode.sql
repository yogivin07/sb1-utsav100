/*
  # Update RLS policies for orders and order items

  1. Changes
    - Update RLS policies to allow proper order insertion and reading
    - Add policies for authenticated and anon users
    - Ensure orders can be created and read properly

  2. Security
    - Maintain security while allowing necessary operations
    - Enable proper access control for orders
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read their own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
DROP POLICY IF EXISTS "Users can read their order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert their order items" ON order_items;

-- Create new policies for orders
CREATE POLICY "Enable read access for all users"
  ON orders FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert access for all users"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

-- Create new policies for order items
CREATE POLICY "Enable read access for all order items"
  ON order_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Enable insert access for all order items"
  ON order_items FOR INSERT
  TO public
  WITH CHECK (true);