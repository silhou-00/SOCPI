"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function NavbarWrapper() {
  const pathname = usePathname();

  // Hide the global Navbar on the landing page — it has its own navigation
  if (pathname === "/") return null;

  return <Navbar />;
}
