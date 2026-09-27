'use client';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HiOutlineClipboardList,
  HiOutlineHome,
  HiOutlineFolderOpen,
  HiOutlineUser,
  HiOutlineCog,
  HiOutlineLogout,
} from "react-icons/hi";

export default function Navbar() {
    const [user, setUser] = useState(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            setUser(null);
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        router.push("/login");
    };

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
                    {user ? (
                        <>
                            <Link href="/account" className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-violet-700">
                                <HiOutlineUser />
                                My Account
                            </Link>
                            <Link href="/settings" className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-violet-700">
                                <HiOutlineCog />
                                Settings
                            </Link>
                            <button onClick={handleLogout} className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-violet-700 transition-colors">
                                <HiOutlineLogout />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-violet-700">
                                <HiOutlineUser />
                                Login
                            </Link>
                            <Link href="/signup" className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-violet-700">
                                <HiOutlineUser />
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </div>

    )
}
