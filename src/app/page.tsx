'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaMapMarkerAlt, FaExchangeAlt } from 'react-icons/fa';

interface Bairro {
    id: number;
    nome: string;
}

interface Taxa {
    id: number;
    valor: number;
    bairroOrigemId: number;
    bairroDestinoId: number;
}

const ClienteTaxaPage: React.FC = () => {
    const [origemId, setOrigemId] = useState<number>(0);
    const [destinoId, setDestinoId] = useState<number>(0);
    const [, setIsMobile] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth <= 768);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const { data: bairros, isLoading: loadingBairros } = useQuery<Bairro[]>({
        queryKey: ['bairros'],
        queryFn: async () => {
            const res = await fetch('/api/bairros');
            if (!res.ok) throw new Error('Erro ao buscar bairros');
            return res.json();
        },
    });

    const { data: taxa, isLoading: loadingTaxa } = useQuery<Taxa>({
        queryKey: ['taxa', origemId, destinoId],
        queryFn: async () => {
            const res = await fetch(`/api/taxas?origemId=${origemId}&destinoId=${destinoId}`);
            if (!res.ok) throw new Error('Erro ao buscar taxa');
            return res.json();
        },
        enabled: !!(origemId && destinoId),
    });

    const handleSwapBairros = () => {
        setOrigemId(destinoId);
        setDestinoId(origemId);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    if (loadingBairros) return (
        <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-16 w-16 border-t-4 border-blue-500 rounded-full"
            />
        </div>
    );

    return (
        <div className="container mx-auto p-4 max-w-md sm:max-w-xl md:max-w-2xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg"
            >
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200 text-center">
                    Consulta de Taxas
                </h1>
                <div className="space-y-4 md:space-y-6">
                    <div>
                        <label htmlFor="origem" className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                            <FaMapMarkerAlt className="inline-block mr-2" />
                            Bairro de Origem:
                        </label>
                        <select
                            id="origem"
                            value={origemId}
                            onChange={(e) => setOrigemId(Number(e.target.value))}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
                        >
                            <option value={0}>Selecione o bairro de origem</option>
                            {bairros?.map((bairro) => (
                                <option key={bairro.id} value={bairro.id}>{bairro.nome}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-center">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={handleSwapBairros}
                            className="bg-blue-500 text-white p-2 rounded-full shadow-md"
                        >
                            <FaExchangeAlt />
                        </motion.button>
                    </div>

                    <div>
                        <label htmlFor="destino" className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
                            <FaMapMarkerAlt className="inline-block mr-2" />
                            Bairro de Destino:
                        </label>
                        <select
                            id="destino"
                            value={destinoId}
                            onChange={(e) => setDestinoId(Number(e.target.value))}
                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
                        >
                            <option value={0}>Selecione o bairro de destino</option>
                            {bairros?.map((bairro) => (
                                <option key={bairro.id} value={bairro.id}>{bairro.nome}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {loadingTaxa && (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-6 text-center text-gray-600 dark:text-gray-400"
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="inline-block h-8 w-8 border-t-4 border-blue-500 rounded-full mr-2"
                            />
                            Buscando taxa...
                        </motion.div>
                    )}
                    {!loadingTaxa && taxa && (
                        <motion.div
                            key="taxa"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mt-6 p-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg shadow-lg text-white"
                        >
                            <h2 className="text-2xl font-semibold mb-4">Taxa encontrada:</h2>
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-4xl font-bold text-center"
                            >
                                {formatCurrency(taxa.valor)}
                            </motion.div>
                        </motion.div>
                    )}
                    {!loadingTaxa && !taxa && origemId && destinoId && (
                        <motion.div
                            key="notFound"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mt-6 p-6 bg-red-100 dark:bg-red-800 rounded-lg shadow-md text-red-700 dark:text-red-200"
                        >
                            Não há taxa cadastrada para esta combinação de bairros.
                        </motion.div>
                    )}
                    {!loadingTaxa && (!origemId || !destinoId) && (
                        <motion.div
                            key="instructions"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="mt-6 text-center text-gray-600 dark:text-gray-400"
                        >
                            <FaSearch className="inline-block mr-2" />
                            Selecione os bairros para consultar a taxa.
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 text-center text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md"
            >
                <p className="text-lg font-semibold mb-2 text-gray-800 dark:text-red-500">! Importante</p>
                <p className="text-sm">As taxas apresentadas são apenas sugestões e podem ser negociadas entre o motoboy e o cliente.</p>
            </motion.div>
        </div>
    );
};

export default ClienteTaxaPage;
