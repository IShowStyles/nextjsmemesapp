"use client";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <Navbar position="sticky" className="bg-background p-2">
      <NavbarBrand>
        <Link href="/" className="font-bold text-lg sm:text-xl">
          MemeDirectory
        </Link>
      </NavbarBrand>
      <NavbarContent className="space-x-2 sm:space-x-4">
        <NavbarItem isActive={pathname === "/table"}>
          <Link
            href="/table"
            className={`text-sm sm:text-base ${
              pathname === "/table" ? "text-primary" : "text-foreground"
            }`}
          >
            Таблиця
          </Link>
        </NavbarItem>
        <NavbarItem isActive={pathname === "/list"}>
          <Link
            href="/list"
            className={`text-sm sm:text-base ${
              pathname === "/list" ? "text-primary" : "text-foreground"
            }`}
          >
            Список
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
