"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";

const NavMenu = () => {
  const { data: session } = useSession();

  return (
    <div className="w-full p-2 flex items-center justify-between">
      <div className="text-xl font-bold">VY Scalper</div>
      <div className="space-x-4">
        {session ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Button
              className="font-bold"
              size="sm"
              onClick={() => {
                signOut();
              }}
            >
              Sign out
            </Button>
          </>
        ) : (
          <>
            <Link
              className={buttonVariants({ variant: "outline", size: "sm" })}
              href="/register"
            >
              Register
            </Link>
            <Link
              className={buttonVariants({ variant: "outline", size: "sm" })}
              href="/login"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default NavMenu;
