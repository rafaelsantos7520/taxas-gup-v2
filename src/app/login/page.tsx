'use client';

import { signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
    const {status } = useSession();
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/adm-taxas');
        }
    }, [status, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = await signIn('credentials', {
            redirect: false,
            username,
            password,
        });

        if (result?.error) {
            setError('Credenciais inválidas!');
        } else {
            router.push('/adm-taxas'); // Redireciona manualmente após login bem-sucedido
        }
    };

    return (
        <div className="flex justify-center items-center  w-full ">
            <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-96 my-auto">
                <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4 bg-blue">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300">Usuário:</label>
                        <input
                            type="text"
                            placeholder="Usuário"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300">Senha:</label>
                        <input
                            type="password"
                            placeholder="Senha"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
                        />
                    </div>
                    {error && <p className="text-red-500 dark:text-red-400">{error}</p>}
                    <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
