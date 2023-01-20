# Notes

## Jan 20

- [x] modal
- [x] create team in a modal
- [x] create team from user profile modal
- role management if you're an admin
- responsiveness prototype
- billing page
- waitlist
- more pixel perfect components
- more react emails
- phone number, phone number confirm (letterloop)
- change to "email sign in link" screen
- add more auth providers
- don't expose radix-ui if you can afford it?
- team profile section in settings
- different routes for teams like vercel

## Jan 18

- always make a team for each user

- move to prisma (done)
- fix members invite

- show how to differentiate more on business logic
  - clean, easy to use function and hook to gate things behind a paywall
  - basic feature flagging framework
- high quality react-email
- instructions on how to strip out frontend

## Jan 17

- might not need to let people define roles, though this could be cool
- added teams management, broken members invite

## Jan 15

- abstract /auth into reusable components

### Managing stuff in the backenda

- authenticating users in the backend

### Emails

- react-email
  - welcome email
  - reset password email

### Orgs and organizations structure

- Invite people
- Have them be part of an organization
- Create, assign, manage roles, and permissions

tables:

User

Organization

OrgUser

Role

OrgRole

## Jan 12

- include in documentation

  - using supabase cli (fetch types)

- planning on using:
  - supabase auth
    - good way to see if you can swap in another auth provider
  - supabase edge functions? or vercel edge functions?
    - probably vercel because its easier to swap out with another provider
- pages needed:
  - /auth/sign-in
  - /auth/sign-up
