import NavigationSidebar from "../../components/app/NavigationSidebar";

export default function SettingsLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <NavigationSidebar
      title={title}
      description={description}
      pages={[
        { name: "Profile", href: "/settings/profile" },
        { name: "Teams", href: "/settings/teams" },
      ]}
    >
      {children}
    </NavigationSidebar>
  );
}
