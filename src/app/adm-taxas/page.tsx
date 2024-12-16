'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import CurrencyInput from 'react-currency-input-field';
import ConfirmationModal from "@/components/ConfirmationModal";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

// Definindo interfaces para Bairro e Taxa
interface Bairro {
  id: number;
  nome: string;
}

interface Taxa {
  id: number;
  bairroOrigemId: number;
  bairroDestinoId: number;
  valor: number;
  bairroOrigem: Bairro;
  bairroDestino: Bairro;
}

const AdminTaxasPage: React.FC = () => {
  const {status } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [taxaAtual, setTaxaAtual] = useState<Partial<Taxa>>({
    id: 0,
    bairroOrigemId: 0,
    bairroDestinoId: 0,
    valor: 0,
  });
  const [modo, setModo] = useState<'criar' | 'editar' | 'visualizar'>('visualizar');
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    taxaId: null as number | null,
  });

  const handleAuth = useCallback(async () => {
    if (status === 'unauthenticated') {
      try {
        const result = await signIn('credentials', { redirect: false });
        if (result?.error) {
          console.error('Erro no login:', result.error);
        } else if (result?.ok) {
          router.push('/dashboard');
        }
      } catch (error) {
        console.error('Erro ao fazer signin:', error);
      }
    }
  }, [status, router]);

  useEffect(() => {
    handleAuth();
  }, [handleAuth]);

  const { data: bairros, isLoading: loadingBairros } = useQuery<Bairro[]>({
    queryKey: ['bairros'],
    queryFn: async () => {
      const res = await fetch('/api/bairros');
      if (!res.ok) throw new Error('Erro ao buscar bairros');
      return res.json();
    },
  });

  const { data: taxas, isLoading: loadingTaxas } = useQuery<Taxa[]>({
    queryKey: ['taxas'],
    queryFn: async () => {
      const res = await fetch('/api/taxas');
      if (!res.ok) throw new Error('Erro ao buscar taxas');
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (novaTaxa: Omit<Taxa, 'id' | 'bairroOrigem' | 'bairroDestino'>) => {
      const res = await fetch('/api/taxas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaTaxa),
      });
      if (!res.ok) throw new Error('Erro ao criar taxa');
      return res.json();
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['taxas'] });
      limparFormulario();
      toast.success(response.updated ? 'Taxa existente atualizada com sucesso!' : 'Nova taxa criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar/atualizar taxa');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (taxaAtualizada: Partial<Taxa>) => {
      const res = await fetch(`/api/taxas`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taxaAtualizada),
      });
      if (!res.ok) throw new Error('Erro ao atualizar taxa');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxas'] });
      limparFormulario();
      toast.success('Taxa atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar taxa');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/taxas?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar taxa');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['taxas'] });
      toast.success('Taxa excluída com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir taxa');
    },
  });

  const limparFormulario = useCallback(() => {
    setTaxaAtual({ id: 0, bairroOrigemId: 0, bairroDestinoId: 0, valor: 0 });
    setModo('visualizar');
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (modo === 'criar') {
      createMutation.mutate(taxaAtual as Omit<Taxa, 'id' | 'bairroOrigem' | 'bairroDestino'>);
    } else {
      updateMutation.mutate(taxaAtual as Taxa);
    }
  }, [modo, taxaAtual, createMutation, updateMutation]);

  const editarTaxa = useCallback((taxa: Taxa) => {
    setTaxaAtual(taxa);
    setModo('editar');
  }, []);

  if (loadingBairros || loadingTaxas) {
    return (
        <div className="flex justify-center items-center h-screen">
          <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="h-16 w-16 border-t-4 border-blue-500 rounded-full"
          />
        </div>
    );
  }

  return (
      <div className="container mx-auto p-2 sm:p-4 max-w-6xl">
        <Toaster position="top-right" />

        <ConfirmationModal
            isOpen={modalConfig.isOpen}
            onClose={() => setModalConfig({ isOpen: false, taxaId: null })}
            onConfirm={() => {
              if (modalConfig.taxaId !== null) {
                deleteMutation.mutate(modalConfig.taxaId);
              }
              setModalConfig({ isOpen: false, taxaId: null });
            }}
            title="Confirmar Exclusão"
            message="Tem certeza que deseja excluir esta taxa? Esta ação não pode ser desfeita."
        />

        <AnimatePresence>
          {modo !== 'visualizar' && (
              <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSubmit}
                  className="mb-4 sm:mb-8 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                  {modo === 'criar' ? 'Criar Nova Taxa' : 'Editar Taxa'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                  <select
                      value={taxaAtual.bairroOrigemId}
                      onChange={(e) => setTaxaAtual({ ...taxaAtual, bairroOrigemId: Number(e.target.value) })}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  >
                    <option value={0}>Selecione o bairro de origem</option>
                    {bairros?.map((bairro) => (
                        <option key={bairro.id} value={bairro.id}>{bairro.nome}</option>
                    ))}
                  </select>
                  <select
                      value={taxaAtual.bairroDestinoId}
                      onChange={(e) => setTaxaAtual({ ...taxaAtual, bairroDestinoId: Number(e.target.value) })}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  >
                    <option value={0}>Selecione o bairro de destino</option>
                    {bairros?.map((bairro) => (
                        <option key={bairro.id} value={bairro.id}>{bairro.nome}</option>
                    ))}
                  </select>
                  <CurrencyInput
                      id="input-valor"
                      name="input-valor"
                      placeholder="Valor da Taxa"
                      defaultValue={taxaAtual.valor}
                      decimalsLimit={2}
                      onValueChange={(value) => setTaxaAtual({ ...taxaAtual, valor: Number(value) || 0 })}
                      prefix="R$ "
                      decimalSeparator=","
                      groupSeparator="."
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
                  >
                    {modo === 'criar' ? <><FaPlus className="inline mr-2" /> Criar Taxa</> : <><FaEdit className="inline mr-2" /> Atualizar Taxa</>}
                  </button>
                  <button
                      type="button"
                      onClick={limparFormulario}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition duration-300"
                  >
                    <FaTimes className="inline mr-2" /> Cancelar
                  </button>
                </div>
              </motion.form>
          )}
        </AnimatePresence>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-200">Taxas Existentes</h2>
            {modo === 'visualizar' && (
                <button
                    onClick={() => setModo('criar')}
                    className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
                >
                  <FaPlus className="inline mr-2" /> Nova Taxa
                </button>
            )}
          </div>
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="min-w-full bg-white dark:bg-gray-800">
              <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-800 dark:text-gray-200">Origem</th>
                <th className="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-800 dark:text-gray-200">Destino</th>
                <th className="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-800 dark:text-gray-200">Valor</th>
                <th className="py-2 px-4 border-b dark:border-gray-600 text-left text-gray-800 dark:text-gray-200">Ações</th>
              </tr>
              </thead>
              <tbody>
              {taxas?.map((taxa) => (
                  <tr key={taxa.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-2 px-2 sm:px-4 border-b dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                      {taxa.bairroOrigem.nome}
                    </td>
                    <td className="py-2 px-2 sm:px-4 border-b dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                      {taxa.bairroDestino.nome}
                    </td>
                    <td className="py-2 px-2 sm:px-4 border-b dark:border-gray-600 text-gray-800 dark:text-gray-200 text-sm sm:text-base">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(taxa.valor)}
                    </td>
                    <td className="py-2 px-2 sm:px-4 border-b dark:border-gray-600">
                      <button
                          onClick={() => editarTaxa(taxa)}
                          className="text-yellow-500 hover:text-yellow-600 mr-2 p-1"
                          title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                          onClick={() => setModalConfig({ isOpen: true, taxaId: taxa.id })}
                          className="text-red-500 hover:text-red-600 p-1"
                          title="Excluir"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
  );
};

export default AdminTaxasPage;
