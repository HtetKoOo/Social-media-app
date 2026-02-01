"use client";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { FaBell, FaBookmark, FaHeart, FaHome } from "react-icons/fa";
import { RiBubbleChartFill } from "react-icons/ri";
import NotificationCount from "../notification/NotificationCount";
import { IoMdMenu } from "react-icons/io";

const links = [
  { href: "/home", icon: <FaHome /> },
  { href: "/liked-posts", icon: <FaHeart /> },
  { href: "/saved-posts", icon: <FaBookmark /> },
  { href: "/notifications", icon: <FaBell /> },
  { href: "/menu", icon: <IoMdMenu /> },
];

export default function Navbar() {
  const pathname = usePathname();

  const handleSignout = async () => {
    await signOut();
  };
  return (
    <nav className="fixed top-0 w-full h-16 bg-dark-1 z-50">
      {/* Links Container - Aligned with Feed */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full mx-2 md:mx-20 lg:mr-20 lg:ml-110 xl:mr-100 pointer-events-auto h-12">
          <ul className="grid grid-cols-5 lg:grid-cols-4 gap-1 h-full text-gray-300">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li
                  key={link.href}
                  className={`h-full ${link.href === "/menu" ? "block lg:hidden" : ""}`}
                >
                  <Link
                    href={link.href}
                    className={`relative w-full h-full flex items-center justify-center rounded-2xl transition-all duration-200 ${isActive
                      ? "bg-primary border-primary text-white shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                      : "bg-dark-2 border-slate-800 hover:bg-dark-3 hover:border-slate-700"
                      }`}
                  >
                    <span className="text-xl">{link.icon}</span>
                    {link.href === "/notifications" && <NotificationCount />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Logo and Logout - Placed on top/sides */}
      <div className="absolute inset-x-0 top-0 h-full flex justify-between items-center px-2 sm:px-10 pointer-events-none">
        {/* Logo */}
        <Link href="/home" className="flex hidden lg:flex items-center gap-2 pointer-events-auto z-20">
          <RiBubbleChartFill size={35} color="#5D5FEF" />
          <span className="text-2xl font-semibold tracking-wide text-gray-400 hidden sm:block">
            Fizzy
          </span>
        </Link>

        {/* Logout */}
        <button
          onClick={handleSignout}
          className="hidden xl:block bg-dark-3 border border-slate-800 hover:border-slate-700 hover:bg-dark-4 cursor-pointer px-3 py-1.5 sm:px-6 sm:py-2 text-xs sm:text-base text-white rounded-2xl transition-colors pointer-events-auto z-20"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
