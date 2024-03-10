"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const NavMenu = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        {session?.user?.name} <br />
        <Link href="/dashboard">Dashboard</Link>
        <button
          onClick={() => {
            signOut();
          }}
        >
          Sign out
        </button>
      </>
    );
  }
  return (
    <div>
      Not Sign in <br />
      <Link href="/register">Register</Link>
      <Link href="/login">Login</Link>
    </div>
  );
};

export default NavMenu;
