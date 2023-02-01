# Neorepo Demo

## Stack

**Frontend framework**: Next.js

**Database**: MySQL on Planetscale

**ORM**: Prisma

**Auth**: [Next-Auth](https://next-auth.js.org/), Google OAuth

**Hosting**: Vercel

**Emails**: Sendgrid, react-email

## General development

Once all this is setup, for daily development, you'll only need to run two commands in two separate terminals:

```
yarn dev
```

```
pscale connect your-db-name your-db-branch-name --port 3309
# ex: pscale connect kitchbook-db main --port 3309
```

When you change the schema in `schema.prisma`, you'll need to run `yarn prisma db push`. This will push your changes to your planetscale db.

## Email developement

If you want to work on the emails, run

```
yarn dev-email
```

## Code structure

Start exploring at `pages/index.tsx`. This is the home page and has an example on how you can call the backend to get a value from the database. Follow the code path in this line:

```
const user = api.user.get.useQuery(undefined, { enabled: !!session });
```

Here, `api` refers to our tRPC API. `user` is a router defined in the `/routers` folder. `useQuery` is a `react-query` wrapper that tRPC provides.

This `user.get` function is defined in `src/server/api/routers/user.ts`

This is a basic example of how you can use Prisma to get values from your Planetscale DB. You'll notice in the frontend, the types are automatically inferred from the return value from Prisma. This DB <-> Frontend type integration is part of what makes this stack so slick.

```
  get: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });

    return user;
  }),
```

See [this](https://create.t3.gg/en/folder-structure) for details on all the files (NOTE: we'll replace this with our own docs page).

DB schema: `schema.prisma`
