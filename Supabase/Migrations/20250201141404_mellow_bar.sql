/*
  # Create events table

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `date` (timestamptz, required)
      - `location` (text)
      - `image_url` (text)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `events` table
    - Add policies for:
      - Anyone can read events
      - Only authenticated users can create events
      - Only event creators can update/delete their events
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  date timestamptz NOT NULL,
  location text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read events
CREATE POLICY "Events are viewable by everyone" 
  ON events
  FOR SELECT 
  USING (true);

-- Allow authenticated users to create events
CREATE POLICY "Authenticated users can create events" 
  ON events
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own events
CREATE POLICY "Users can update their own events" 
  ON events
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Allow users to delete their own events
CREATE POLICY "Users can delete their own events" 
  ON events
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);