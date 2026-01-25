import { redirect } from "next/navigation";
import { auth } from "../../auth";
import SigninComponent from "../components/auth/SigninComponent";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/home");
  }
  return <SigninComponent />;
}
