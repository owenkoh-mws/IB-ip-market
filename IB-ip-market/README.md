# IB-ip-market

Webflow auth scripts mirrored from Webflow inline code.

## Notes - 2025-09-27

- Integrated Supabase auth (signup/login) with clear separation of presentation and business logic.
- Implemented GNB visibility rules: show `[data-auth="gnb-logout"]` when signed in; otherwise show login/signup.
- Added top-right green logout toast (single message) with conflict guards.
- Added `supabase/profiles.sql` for `public.profiles` with triggers to seed/sync from `auth.users` and RLS policies.
- Wired signup UI to upsert user profile and optionally display it via `data-auth="signup-profile-debug"`.
- Registered Webflow inline scripts: `IBAuthCore` v1.1.0 and `IBAuthUI` v1.1.0.
- Re-pointed Git remote to `https://github.com/owenkoh-mws/IB-ip-market.git` and pushed local history.

