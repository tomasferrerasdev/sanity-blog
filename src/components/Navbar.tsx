import Link from "next/link";
import React from "react";
import { ThemeSwitch } from "./ThemeSwitch";

export const Navbar = () => {
  return (
    <nav className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between items-center">
        <Link href={`/`}>tomasfdev</Link>
        <ThemeSwitch />
      </div>
    </nav>
  );
};
