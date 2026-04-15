-- Create the gallery storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Policies for public reading
CREATE POLICY "gallery_public_read" ON storage.objects 
FOR SELECT USING (bucket_id = 'gallery');

-- Policies for authenticated users to manage objects in the gallery bucket
CREATE POLICY "gallery_auth_upload" ON storage.objects 
FOR INSERT WITH CHECK (auth.role() = 'authenticated' AND bucket_id = 'gallery');

CREATE POLICY "gallery_auth_update" ON storage.objects 
FOR UPDATE USING (auth.role() = 'authenticated' AND bucket_id = 'gallery');

CREATE POLICY "gallery_auth_delete" ON storage.objects 
FOR DELETE USING (auth.role() = 'authenticated' AND bucket_id = 'gallery');
