import { getAccounts } from "@/app/action";
import GetTokenForm from "@/components/GetTokenForm";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  PencilIcon,
  PlayIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/login");
  }
  const accounts = await getAccounts();
  return (
    <main className="h-screen flex flex-col items-center justify-start py-8 px-2">
      <div className="fixed bottom-8 right-6">
        <Link className={buttonVariants()} href="/account/add">
          <PlusIcon className="size-4 mr-2" />
          Add Account
        </Link>
      </div>
      <h2 className="text-xl">Accounts</h2>
      <div className="w-full space-y-2">
        {accounts?.map((account) => {
          const isValid: boolean =
            account.token != "" &&
            account.tokenExp === new Date().toDateString();
          account._id = account._id?.toString();
          return (
            <Card key={account.userId}>
              <CardContent className="flex p-2 justify-between items-center">
                <Link
                  href={isValid ? `/terminal/${account._id}` : "#"}
                  className={`${buttonVariants({
                    size: "sm",
                    variant: "outline",
                  })} p-2 mr-4 ${
                    isValid
                      ? "text-green-500"
                      : "text-red-500 cursor-not-allowed"
                  } `}
                >
                  <PlayIcon className="size-4" />
                </Link>
                <div className="flex flex-auto gap-4">
                  <span className="basis-24 h-6 overflow-hidden">
                    {account.name}
                  </span>
                  <span className="capitalize basis-24">{account.broker}</span>
                  <span>{account.userId}</span>
                </div>
                <div className="flex">
                  <GetTokenForm id={account._id} />
                  <Link
                    href={`/account/edit/${account._id}`}
                    className={buttonVariants({
                      size: "sm",
                      variant: "outline",
                    })}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Link>
                  <Button size="sm" variant="destructive" className="p-2">
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </main>
  );
}
