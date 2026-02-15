"use client";

import { useAppContext } from "@/lib/context/AppContext";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const { currentBoard } = useAppContext();

  return (
    <div className="bg-charade-800 p-4 flex flex-row justify-between items-center w-[calc(100vw-16rem)] h-16">
      <div className="nav-left flex flex-row items-center">
        <h1 className="text-2xl font-semibold">{currentBoard?.name}</h1>
      </div>
      <div className="nav-right flex flex-row items-center space-x-4">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <button className="cursor-pointer">
          <i className="fa-solid fa-sun text-xl" />
        </button>
      </div>
    </div>
  );
}
