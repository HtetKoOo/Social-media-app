import React from "react";
import LeftSidebar from "@/components/general/LeftSidebar";
import Rightsidebar from "@/components/general/Rightsidebar";

export default async function ThreeColLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <LeftSidebar />
      <div className="md:mx-20 lg:ml-110 xl:mr-100">
        {children}
      </div>
      <Rightsidebar />
    </>
  );
}
