/*
# Create Reviews Table
This migration adds a reviews system to allow customers to rate and comment on products.

## Query Description:
This operation creates a new 'reviews' table linked to both 'products' and 'users'. It includes RLS policies to allow public reading and authenticated insertion.

## Metadata:
- Schema-Category: Structural
- Impact-Level: Low
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Table: reviews
- Columns: id, product_id, user_id, user_name, rating, comment, created_at
- Constraints: Foreign keys to products and users

## Security Implications:
- RLS Status: Enabled
- Policy Changes: Yes
- Auth Requirements: Required for posting reviews
*/

CREATE TABLE IF NOT EXISTS public.reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.users(id) ON DELETE SET NULL,
    user_name character varying NOT NULL,
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read reviews
CREATE POLICY "Allow public read access to reviews" ON public.reviews
    FOR SELECT USING (true);

-- Allow authenticated users to insert reviews
CREATE POLICY "Allow authenticated insert access to reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
