import NavigationSidebarWrapper from "../../components/app/NavigationSidebarWrapper";

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
    <NavigationSidebarWrapper
      title={title}
      description={description}
      pages={[
        { name: "Profile", href: "/settings/profile" },
        { name: "Teams", href: "/settings/teams" },
      ]}
    >
      {children}
    </NavigationSidebarWrapper>
  );
}
