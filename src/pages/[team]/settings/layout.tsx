import type { LinkProps } from "next/link";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../../../components/app/Header";
import cn from "../../../lib/cn";
import { useTeam } from "../../../lib/useTeam";

function PageLink({
  name,
  isSelected,
  href,
}: {
  name: string;
  href: LinkProps["href"];
  isSelected: boolean;
}) {
  return (
    <Link
      className={cn(
        "-ml-3 flex h-9 w-full items-center rounded px-3 text-left",
        {
          "bg-primary-100 font-semibold text-primary-800": isSelected,
          "hover:bg-slate-100": !isSelected,
        }
      )}
      href={href}
    >
      {name}
    </Link>
  );
}

export default function SettingsLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  const { slug } = useTeam();
  const router = useRouter();

  const WORKSPACE_PAGES = [
    {
      name: "General",
      href: { pathname: `/[team]/settings/general`, query: { team: slug } },
    },
    {
      name: "Members",
      href: { pathname: `/[team]/settings/members`, query: { team: slug } },
    },
    {
      name: "Billing",
      href: { pathname: `/[team]/settings/billing`, query: { team: slug } },
    },
  ];

  const ACCOUNT_PAGES = [
    {
      name: "Profile",
      href: {
        pathname: `/[team]/settings/account/profile`,
        query: { team: slug },
      },
    },
  ];

  return (
    <section className="flex h-full min-h-screen flex-col">
      <Header />
      <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-4 px-4">
        <div className="col-span-1 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Workspace
          </p>
          <div className="flex flex-col items-start gap-y-[2px] transition">
            {WORKSPACE_PAGES.map(({ name, href }) => {
              const hrefUrl = typeof href === "string" ? href : href.pathname;
              return (
                <PageLink
                  key={name}
                  name={name}
                  href={href}
                  isSelected={router.pathname === hrefUrl}
                />
              );
            })}
          </div>
          <p className="mt-8 mb-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Account
          </p>
          <div className="flex flex-col items-start gap-y-[2px] transition">
            {ACCOUNT_PAGES.map(({ name, href }) => {
              const hrefUrl = typeof href === "string" ? href : href.pathname;
              return (
                <PageLink
                  key={name}
                  name={name}
                  href={href}
                  isSelected={router.pathname === hrefUrl}
                />
              );
            })}
          </div>
        </div>
        <div className="col-span-3 py-4">
          <h1 className="text-2xl font-medium">{title}</h1>
          <p className="text-slate-500">{description}</p>
          <div className="my-8 w-full border-b border-slate-100" />
          {children}
        </div>
      </div>
    </section>
  );
}
