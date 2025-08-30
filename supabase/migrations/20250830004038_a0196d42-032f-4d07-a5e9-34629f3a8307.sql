-- Create applications table to store form submissions
CREATE TABLE public.applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  discord_username TEXT NOT NULL,
  discord_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  size TEXT NOT NULL,
  race TEXT NOT NULL,
  hair_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  height TEXT NOT NULL,
  weight TEXT NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'))
);

-- Create admin users table for authentication
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for applications (allow insert for anyone, select only for authenticated users)
CREATE POLICY "Anyone can submit applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Only authenticated users can view applications" 
ON public.applications 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create policies for admin users (only authenticated users can access)
CREATE POLICY "Only authenticated users can access admin_users" 
ON public.admin_users 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Insert the admin user with hashed password
INSERT INTO public.admin_users (username, password_hash) 
VALUES ('condemnable', crypt('esexwarrior123', gen_salt('bf')));

-- Create function to verify admin login
CREATE OR REPLACE FUNCTION verify_admin_login(username_input TEXT, password_input TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE username = username_input 
    AND password_hash = crypt(password_input, password_hash)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get applications for admin
CREATE OR REPLACE FUNCTION get_applications()
RETURNS TABLE (
  id UUID,
  discord_username TEXT,
  discord_id TEXT,
  full_name TEXT,
  age INTEGER,
  size TEXT,
  race TEXT,
  hair_type TEXT,
  reason TEXT,
  height TEXT,
  weight TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY SELECT 
    a.id, a.discord_username, a.discord_id, a.full_name, a.age, 
    a.size, a.race, a.hair_type, a.reason, a.height, a.weight, 
    a.photo_url, a.created_at, a.status
  FROM public.applications a
  ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;