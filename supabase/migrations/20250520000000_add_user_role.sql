/*
# Add Role to Users Table
Adds a role column to the users table to distinguish between customers and admins.

## Query Description:
This operation adds a 'role' column to the 'users' table. 
Existing users will be assigned the 'customer' role by default.
This is a safe operation that doesn't delete any data.

## Metadata:
- Schema-Category: Structural
- Impact-Level: Low
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Table: users
- Column Added: role (text, default: 'customer')

## Security Implications:
- RLS Status: Unchanged
- Policy Changes: No
- Auth Requirements: Admin access will be checked in the application logic based on this column.
*/

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS role text DEFAULT 'customer';
