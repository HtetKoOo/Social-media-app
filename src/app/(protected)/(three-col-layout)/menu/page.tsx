"use client";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { BiMoviePlay } from "react-icons/bi";
import { FaBookmark, FaSignOutAlt, FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useGetUser } from "../../../../../custom-hooks/useUser";

const menuLinks = [
    {
        href: "/saved-posts",
        icon: <FaBookmark size={20} className="text-gray-200" />,
        label: "Saved Posts",
    },
    {
        href: "/reels",
        icon: <BiMoviePlay size={20} className="text-gray-200" />,
        label: "Reels",
    },
    {
        href: "/followers",
        icon: <FaUser size={20} className="text-gray-200" />,
        label: "Followers",
    },
    {
        href: "/following",
        icon: <FaUser size={20} className="text-gray-200" />,
        label: "Following",
    },
    {
        href: "/settings",
        icon: <IoMdSettings size={20} className="text-gray-200" />,
        label: "Settings",
    },
    {
        href: "#",
        icon: <FaSignOutAlt size={20} className="text-red-500" />,
        label: "Logout",
        textColor: "text-red-500",
    },
];

export default function MenuPage() {
    const { isLoading, data: user } = useGetUser();

    const handleSignout = async () => {
        await signOut();
    };

    return (
        <div className="flex flex-col gap-4">
            <Link
                href="/profile"
                className="flex items-center gap-1 sm:gap-2 px-1 sm:px-2 py-1 rounded-2xl cursor-pointer bg-dark-3 hover:bg-dark-4"
            >
                <div className="relative w-14 h-14 sm:w-18 sm:h-18 shrink-0">
                    {isLoading ? (
                        <div className="animate-pulse rounded-full w-14 h-14 sm:w-18 sm:h-18 bg-dark-4"></div>
                    ) : (
                        <div className="relative block w-full h-full rounded-full overflow-hidden border-4 border-dark-4">
                            <Image
                                src={user?.image || "/images/avatar.png"}
                                alt="profile-pic"
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-200">{user?.name}</h2>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                {/* down arrow icon */}
                <div className="mr-4">
                    <MdOutlineKeyboardArrowDown size={25} className="text-gray-200" />
                </div>
            </Link>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 lg:gap-1">
                {menuLinks.map((link) => {
                    const isLogout = link.label === "Logout";
                    const Content = () => (
                        <>
                            <div className="flex items-center justify-center w-10 h-10 sm:w-14 sm:h-14 shrink-0">
                                {link.icon}
                            </div>
                            <div className="flex-1">
                                <h2
                                    className={`text-md ${link.textColor || "text-gray-200"
                                        }`}
                                >
                                    {link.label}
                                </h2>
                            </div>
                        </>
                    );

                    const commonClasses =
                        "flex items-center justify-center gap-1 sm:gap-2 px-1 sm:px-2 py-2 rounded-2xl cursor-pointer bg-dark-3 hover:bg-dark-4";

                    if (isLogout) {
                        return (
                            <div
                                key={link.label}
                                onClick={handleSignout}
                                className={commonClasses}
                            >
                                <Content />
                            </div>
                        );
                    }

                    return (
                        <Link key={link.label} href={link.href} className={commonClasses}>
                            <Content />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}