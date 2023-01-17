import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../../components/app/Header";
import { api } from "../../utils/api";

function Page({
  name,
  isSelected,
  href,
}: {
  name: string;
  isSelected: boolean;
  href: string;
}) {
  return (
    <Link
      className={clsx(
        "-ml-3 flex h-8 w-full items-center rounded px-3 text-left font-medium",
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
  const user = api.user.get.useQuery();
  const router = useRouter();
  const { pathname } = router;

  return (
    <section className="flex h-full min-h-screen flex-col bg-white">
      <Header />
      <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-4 px-4">
        <div className="col-span-1 p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Settings
          </p>
          <div className="flex flex-col items-start gap-y-[2px] transition">
            <Page
              name="Profile"
              isSelected={pathname === "/settings/profile"}
              href="/settings/profile"
            />
            {user.data?.current_team === null ? (
              <Page
                name="Teams"
                isSelected={pathname === "/settings/teams"}
                href="/settings/teams"
              />
            ) : (
              <Page
                name="Members"
                isSelected={pathname === "/settings/members"}
                href="/settings/members"
              />
            )}
            <Page
              name="Billing"
              isSelected={pathname === "/settings/billing"}
              href="/settings/billing"
            />
          </div>
        </div>
        <div className="col-span-3 p-4">
          <h1 className="text-2xl font-medium">{title}</h1>
          <p className="text-slate-500">{description}</p>
          <div className="my-8 w-full border-b border-slate-100" />
          {children}
        </div>
      </div>
    </section>
  );
}
