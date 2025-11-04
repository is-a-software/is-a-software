"use client";

import { Button } from "@/app/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import StarUs from "@/app/components/Star";
import { useAuth } from "@/app/contexts/AuthContext";

interface NavbarProps {
  currentPage?:
    | "home"
    | "dashboard"
    | "docs"
    | "api"
    | "about"
    | "login"
    | "privacy"
    | "terms";
}

export function Navbar({ currentPage = "home" }: NavbarProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-[#0a0a0a] via-[#0C0C0C] to-[#0a0a0a] backdrop-blur-md border-b border-[#333333] sticky top-0 z-50 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xl font-bold text-white hover:text-gray-300 transition-colors"
            >
              is-a.software
            </Link>
          </div>

          {/* Centered Navigation */}
          <nav className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`px-3 py-2 transition-colors duration-200 ${
                currentPage === "home"
                  ? "text-white font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Home
            </Link>

            <Link
              href="/dashboard"
              className={`px-3 py-2 transition-colors duration-200 ${
                currentPage === "dashboard"
                  ? "text-white font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/endpoint"
              className={`px-3 py-2 transition-colors duration-200 ${
                currentPage === "api"
                  ? "text-white font-bold"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              API
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <StarUs />

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  {user.photoURL && (
                    <Image
                      src={user.photoURL}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full border border-[#333333]"
                    />
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="border-[#333333] text-gray-300 hover:bg-[#0C0C0C] hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#333333] text-gray-300 hover:bg-[#0C0C0C] hover:text-white"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
