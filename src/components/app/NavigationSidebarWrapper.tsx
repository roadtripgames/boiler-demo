import type { LinkProps } from "next/link";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "./Header";

function Page({
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
      className={clsx(
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

export default function NavigationSidebarWrapper({
  children,
  title,
  description,
  pages,
}: {
  pages: { name: string; href: LinkProps["href"] }[];
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  const router = useRouter();

  return (
    <section className="flex h-full min-h-screen flex-col">
      <Header />
      <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-4 px-4">
        <div className="col-span-1 p-4">
          <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Settings
          </p>
          <div className="flex flex-col items-start gap-y-[2px] transition">
            {pages.map(({ name, href }) => {
              const hrefUrl = typeof href === "string" ? href : href.pathname;
              return (
                <Page
                  envKey={name}
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
