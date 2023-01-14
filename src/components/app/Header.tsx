import Image from "next/image";
import companyLogo from "../../../public/logo.svg";

export default function Header() {
  return (
    <div>
      <div className="flex items-center justify-between bg-slate-900 px-4 py-2">
        <Image src={companyLogo} alt={"company logo"} />
      </div>
    </div>
  );
}
