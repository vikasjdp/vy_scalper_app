import { getAccount } from "@/app/action";
import EditAccountForm from "@/components/EditAccountForm";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditPage({ params }: { params: { id: string } }) {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/login");
  }
  const account = await getAccount(params.id);

  if (!account) {
    redirect("/dashboard");
  }
  if (account._id) {
    account._id = account._id.toString();
  }
  const id = account._id?.toString();
  return (
    <div className="max-w-96 m-auto">
      <div className="relative flex justify-center items-center my-4">
        <h2 className="text-2xl">Edit a/c ({account.userId})</h2>
        <Link
          href="/dashboard"
          className={`${buttonVariants()} absolute top-1/2 -translate-y-1/2 left-2`}
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
      </div>
      <EditAccountForm account={account} id={id!} />
    </div>
  );
}
