import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import Header from "../../../components/app/Header";
import { api } from "../../../utils/api";
import SettingsLayout from "./layout";

export default function General() {
  const router = useRouter();
  const { pathname } = router;

  return (
    <SettingsLayout title="General" description="Your team settings">
      TODO
    </SettingsLayout>
  );
}
