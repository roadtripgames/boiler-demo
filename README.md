# Boiler Demo

## Stack

**Frontend framework**: Next.js

**Database**: MySQL on Planetscale

**ORM**: Prisma

**Auth**: [Next-Auth](https://next-auth.js.org/), Google OAuth

**Hosting**: Vercel

**Emails**: Sendgrid, react-email

## Setup

We're going to:

1. Clone and init the repo
2. Download and connect to Planetscale
3. Set your environment variables in vercel
4. Run the project locally

Everything you need should be in this README, but we've provided links if you want to explore these tools and concepts further.

### Vercel

Create a new project in Vercel and link this repo. The build will run but fail because you'll need to configure your environment variables. You'll need to set 6 environment variables in Vercel:
`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and
`SENDGRID_API_KEY`. Vercel lets you set different variables for local development and production. We'll mention when you need to set separate values for this.

**SENDGRID_API_KEY**

This is your Sendgrid key from https://app.sendgrid.com/settings/api_keys.
Set this for "Development," "Preview," and "Production"

**DATABASE_URL**

You'll need to create a new database in Planetscale. Go through their onboarding and create a database. Once that's created, click on "Connect".

![connect](/readme/pscale-connect.png)

Make sure "Connect with" is set to "Prisma." Copy the `DATABASE_URL` string into Vercel. Only copy the part that starts with `mysql://` instead of the whole line.

![url](/readme/pscale-url.png)

Set the value from the Planetscale website to "Preview" and "Production".
For development, set "mysql://root@127.0.0.1:3309/your-planetscale-db-name"

**NEXTAUTH_SECRET**

Run this command and copy the value into vercel. This generates a secret that Next Auth will use to encrpyt sensitive user data.

```
openssl rand -base64 32
```

Set this for "Development," "Preview," and "Production"

**NEXTAUTH_URL**

This only needs to be set locally, set this to `localhost:3000`
Set this for "Development" only.

**GOOGLE_CLIENT_ID**, **GOOGLE_CLIENT_SECRET**

These are your OAuth client ids and secrets. This is probably the hardest step. We need to go to your cloud console and create secrets that we'll use for Google authentication. Go here first: https://console.cloud.google.com/apis/credentials

Click on "Create credentials" and then "OAuth client ID". If you don't have your OAuth consent screen configured, you'll have to do that. Google requires you to fill in your org info for security purposes. If you've already set up Google OAuth in your GCloud org, you can skip this.

![create](/readme/gcloud-create.png)

Fill in these values, but replace references to `boiler-omega` with your vercel URL / website URL.

![config](/readme/gcloud-config.png)

If you want more detail, [here](https://developers.google.com/identity/protocols/oauth2) is the Google documentation. At the end of this, you'll be able to download a json file with these values.

Set these values for "Development," "Preview," and "Production"

At the end of all of this, your Vercel environemnt variable setup should look something like this.

![env](/readme/vercel-env.png)

### Clone and setup

In your terminal, run these commands and follow the instructions.

```
git clone git@github.com:roadtripgames/boiler-demo.git

# planetscale
brew install planetscale/tap/pscale
brew install mysql-client
pscale auth login
pscale org list
pscale org switch your-planetscale-org-name

# vercel
vercel login
vercel link
vercel env pull .env.local

```

## General development

Once all this is setup, for daily development, you'll only need to run two commands in two separate terminals:

```
yarn dev
```

```
pscale connect your-db-name your-db-branch-name --port 3309
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

See [this](https://create.t3.gg/en/folder-structure) for details on all the files (NOTE: we'll replace this with our own docs page)
