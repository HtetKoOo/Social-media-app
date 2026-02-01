"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useGetUser } from "../../../custom-hooks/useUser";
import LeftSidebarSkeleton from "../skeletons/LeftSidebarSkeleton";
import MenuPage from "@/app/(protected)/(three-col-layout)/menu/page";

export default function LeftSidebar() {
  const { isLoading, isError, error, data: user } = useGetUser();

  if (isLoading) return <LeftSidebarSkeleton />
  if (isError) return <h1 className="text-gray-300">{error.message}</h1>;

  return (
    <aside className="min-h-screen fixed top-17 left-10 w-[400px] hidden lg:block">
      {/* search */}
      <div className="bg-dark-3 rounded-full m-5 flex items-center gap-2">
        <input type="text" placeholder="Search" className="w-full bg-dark-3 rounded-2xl py-3 px-5 text-gray-200 border-none focus:outline-none" />
      </div>
      {/* menu */}
      <div className="bg-dark-3 rounded-2xl m-5 p-2"><MenuPage /></div>
    </aside>
  );
}
