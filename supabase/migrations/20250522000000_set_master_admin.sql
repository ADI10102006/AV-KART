/*
# Set Master Admin Role
Assigns the 'admin' role to the specific master email address.

## Query Description:
This operation updates the 'users' table to ensure the specified email has administrative privileges.
If the user doesn't exist in the public.users table yet, it will be handled automatically upon their first login.

## Metadata:
- Schema-Category: Structural
- Impact-Level: Low
- Requires-Backup: false
- Reversible: true

## Structure Details:
- Table: users
- Column: role
- Value: 'admin'
*/

UPDATE users 
SET role = 'admin' 
WHERE email = 'adiarivu2006@gmail.com';
