import NavigationSidebar from "../../../components/app/NavigationSidebar";
import { useTeam } from "../../../lib/useTeam";

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

  return (
    <NavigationSidebar
      title={title}
      description={description}
      pages={[
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
      ]}
    >
      {children}
    </NavigationSidebar>
  );
}
