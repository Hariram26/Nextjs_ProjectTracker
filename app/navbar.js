import React from "react";
import Link from "next/link";
import {
  HiOutlineClipboardList,
  HiOutlineHome,
  HiOutlineFolderOpen,
  HiOutlineUser,
  HiOutlineCog,
} from "react-icons/hi";

export default function Navbar() {

    return (

        <div className="navbar w-1/5 min-h-screen bg-violet-800 text-white p-6 flex flex-col items-start gap-4">
            <h1 className="text-xl font-bold flex items-center gap-2">
                <HiOutlineClipboardList />
                Project Tracker
            </h1>
            <nav className="w-full space-y-2">
                <Link href="/" className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-violet-700">
                    <HiOutlineHome />
                    Home
                </Link>
                <Link href="/projects" className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-violet-700">
                    <HiOutlineFolderOpen />
                    Projects
                </Link>
            </nav>

            <div className="mt-auto w-full pt-4 border-t border-white/20">
                <nav className="w-full space-y-2">
                    <Link href="/account" className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-violet-700">
                        <HiOutlineUser />
                        My Account
                    </Link>
                    <Link href="/settings" className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-violet-700">
                        <HiOutlineCog />
                        Settings
                    </Link>
                </nav>
            </div>
        </div>

    )
}