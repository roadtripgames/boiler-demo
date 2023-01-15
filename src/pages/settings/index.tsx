import Link from "next/link";
import Header from "../../components/app/Header";
import { useAuth } from "../../lib/auth";
import SettingsLayout from "./layout";

export default function Home() {
  const { loading: isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return <SettingsLayout>okay!</SettingsLayout>;
}
