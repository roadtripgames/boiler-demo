import { useRouter } from "next/router";
import NavigationSidebar from "../../../components/app/NavigationSidebar";

export default function SettingsLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  const router = useRouter();
  const team = router.query.team as string;

  return (
    <NavigationSidebar
      title={title}
      description={description}
      pages={[
        {
          name: "General",
          href: { pathname: `/[team]/settings/general`, query: { team } },
        },
        {
          name: "Members",
          href: { pathname: `/[team]/settings/members`, query: { team } },
        },
        {
          name: "Billing",
          href: { pathname: `/[team]/settings/billing`, query: { team } },
        },
      ]}
    >
      {children}
    </NavigationSidebar>
  );
}
