/*
  # Create orders and order items tables

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `customer_name` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `total_amount` (decimal)
      - `created_at` (timestamp)
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `description` (text)
      - `quantity` (integer)
      - `price` (decimal)
      - `total` (decimal)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  total_amount decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id),
  description text NOT NULL,
  quantity integer NOT NULL,
  price decimal(10,2) NOT NULL,
  total decimal(10,2) NOT NULL
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT auth.uid()
    FROM auth.users
    WHERE users.email = orders.email
  ));

CREATE POLICY "Users can insert their own orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read their order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (order_id IN (
    SELECT id
    FROM orders
    WHERE auth.uid() IN (
      SELECT auth.uid()
      FROM auth.users
      WHERE users.email = orders.email
    )
  ));

CREATE POLICY "Users can insert their order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);