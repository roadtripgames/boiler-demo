import { SlashIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import companyLogo from "../../../public/logo.svg";
import TeamSelector from "./TeamSelector";
import UserProfileButton from "./UserProfileButton";

export default function Header() {
  const router = useRouter();
  const team = router.query.team as string;
  const logoLink = team ? `/${team}` : "/";

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-x-2">
            <Link href={logoLink}>
              <Image src={companyLogo} alt={"company logo"} />
            </Link>
            <SlashIcon />
            <TeamSelector />
          </div>
          <UserProfileButton />
        </div>
      </nav>
    </header>
  );
}
