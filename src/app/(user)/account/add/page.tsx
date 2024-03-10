import AddAccountForm from "@/components/AddAccountForm";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AddAccount() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-96 m-auto">
      <div className="relative flex justify-center items-center my-4">
        <h2 className="text-2xl">Add Account</h2>
        <Link
          href="/dashboard"
          className={`${buttonVariants()} absolute top-1/2 -translate-y-1/2 left-2`}
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
      </div>
      <AddAccountForm />
    </div>
  );
}
