import { getAccount } from "@/app/action";
import StoreProvider from "@/components/StoreProvider";
import Terminal from "@/components/Terminal";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function TerminalPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession();

  if (!session || !session.user) {
    redirect("/login");
  }
  const id = params.id;
  const account = await getAccount(id);
  let wsurl: string;
  if (account?.broker === "finvasia") {
    wsurl = "wss://api.shoonya.com/NorenWSTP/";
  } else {
    throw Error("Notcode edefose");
  }
  return (
    <StoreProvider>
      <Terminal account={account} wsurl={wsurl} />;
    </StoreProvider>
  );
}
