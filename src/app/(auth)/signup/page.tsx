import { redirect } from "next/navigation";
import { auth } from "../../../../auth";
import SignupComponent from "../../../components/auth/SignupComponent";


export default async function SignupPage() {

   const session = await auth();
  
    if (session) {
      redirect("/home");
    }
  return (
    <SignupComponent/>  
  );
}
