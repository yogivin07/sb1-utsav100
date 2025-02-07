/*
  # Insert sample events data with user

  1. Changes
    - Create a sample user in auth.users
    - Insert sample events linked to the created user

  2. Security
    - Maintains referential integrity with auth.users table
    - Uses proper foreign key relationships
*/

-- First create a user in auth.users
INSERT INTO auth.users (
  id,
  email,
  created_at
)
SELECT 
  'c9c1c9c1-c9c1-c9c1-c9c1-c9c1c9c1c9c1'::uuid,
  'events-demo@example.com',
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE id = 'c9c1c9c1-c9c1-c9c1-c9c1-c9c1c9c1c9c1'::uuid
);

-- Then insert the events using the created user's ID
INSERT INTO events (
  title,
  description,
  date,
  location,
  image_url,
  user_id
)
VALUES
  (
    'Tech Conference 2024',
    'Join us for the biggest tech conference of the year featuring industry leaders and innovative workshops.',
    NOW() + interval '30 days',
    'San Francisco Convention Center',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
    'c9c1c9c1-c9c1-c9c1-c9c1-c9c1c9c1c9c1'::uuid
  ),
  (
    'Summer Music Festival',
    'A three-day music extravaganza featuring top artists from around the world.',
    NOW() + interval '60 days',
    'Central Park, New York',
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop',
    'c9c1c9c1-c9c1-c9c1-c9c1-c9c1c9c1c9c1'::uuid
  ),
  (
    'AI Workshop Series',
    'Learn about the latest developments in artificial intelligence and machine learning.',
    NOW() + interval '15 days',
    'Online Virtual Event',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop',
    'c9c1c9c1-c9c1-c9c1-c9c1-c9c1c9c1c9c1'::uuid
  ),x`
  (
    'Global Food Festival',
    'Experience culinary delights from around the world with top chefs and food artisans.',
    NOW() + interval '45 days',
    'Downtown Food District',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop',
    'c9c1c9c1-c9c1-c9c1-c9c1-c9c1c9c1c9c1'::uuid
  ),
  (
    'Startup Pitch Night',
    'Watch innovative startups pitch their ideas to investors and industry experts.',
    NOW() + interval '7 days',
    'Innovation Hub',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop',
    'c9c1c9c1-c9c1-c9c1-c9c1-c9c1c9c1c9c1'::uuid
  );