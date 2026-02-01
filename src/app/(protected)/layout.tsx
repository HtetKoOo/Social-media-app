import React from "react";
import { auth } from "@/../auth";
import { redirect } from "next/navigation";
import Navbar from "@/components/general/Navbar";

export default async function ProtectedLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const session = await auth();

    if (!session) {
        redirect("/");
    }
    return (
        <>
            <Navbar />
            <div className="text-white mt-20">
                {children}
            </div>
        </>
    );
}
