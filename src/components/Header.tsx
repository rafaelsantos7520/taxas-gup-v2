'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { FaHome, FaSignInAlt, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import ClientThemeToggle from "@/components/ClienteThemToggle";
import Image from "next/image";

export default function Header() {
    const { data: session } = useSession();

    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className={'relative w-20 h-20'}>
                    <Image className={'object-cover w-full'} src={'/logos/ENTREGAS.svg'} alt={'Logo'} fill />

                </div>
                <nav className="flex items-center space-x-2 md:space-x-4">
                    <ClientThemeToggle />
                    <Link href="/" className="flex items-center space-x-1 px-2 md:px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm md:text-base">
                        <FaHome />
                        <span>Home</span>
                    </Link>
                    {session ? (
                        <>
                            <Link href="/adm-taxas" className="flex items-center space-x-1 px-2 md:px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm md:text-base">
                                <FaUserShield />
                                <span>Administração</span>
                            </Link>
                            <button
                                onClick={() => signOut({ callbackUrl: '/' })}
                                className="flex items-center space-x-1 px-2 md:px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm md:text-base"
                            >
                                <FaSignOutAlt />
                                <span>Sair</span>
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className="flex items-center space-x-1 px-2 md:px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm md:text-base">
                            <FaSignInAlt />
                            <span>Login</span>
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
}
