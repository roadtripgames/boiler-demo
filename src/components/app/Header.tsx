import Image from "next/image";
import companyLogo from "../../../public/logo.svg";
import { useUser } from "../../lib/user";
import UserProfileButton from "./UserProfileButton";

export default function Header() {
  return (
    <header className="border-b">
      <nav className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between px-4 py-2">
          <Image src={companyLogo} alt={"company logo"} />
          <UserProfileButton />
        </div>
      </nav>
    </header>
  );
}
