# Notes

## General TODO

- stripe implementation
- more pixel perfect components
- responsiveness prototype
- magic link auth
- implement reset password functionality
- implement email invite functionality
- implement loading screens for some components
- use get serverside props for everything
- delete confirm modal
- make logo png because svgs aren't correctly cached by google image server
- analytics
- waitlist
- nice ui components

## scrapped

- phone number, phone number confirm (letterloop)
- add more auth providers

## Jan 24

- [x] fix email design (images)
- [x] implement email/password auth
- [x] ssg for members page
- [x] dedupe if conflicting team slugs
- [x] resend invite email
- [x] leave team

## Jan 23

- [x] team profile section in settings
- [x] different routes for teams like vercel

- 2pm EST / 11am PST
- evaluate using the repository
- using it with kitchbook/letterloop
- need: basic instructions on cloning, using the repo
- need: some documentation on how to use it

## Jan 20

- [x] modal
- [x] create team in a modal
- [x] create team from user profile modal
- [x] create team for all users
- [x] role management if you're an admin

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
