import Image from "next/image";
import Link from "next/link";
import companyLogo from "../../../public/logo.svg";
import UserProfileButton from "./UserProfileButton";

export default function Header() {
  return (
    <header className="border-b">
      <nav className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between px-4 py-2">
          <Link href="/">
            <Image src={companyLogo} alt={"company logo"} />
          </Link>
          <UserProfileButton />
        </div>
      </nav>
    </header>
  );
}
