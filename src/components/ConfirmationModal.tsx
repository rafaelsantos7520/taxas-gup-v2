'use client';

import { motion, AnimatePresence } from 'framer-motion';



interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                    onClick={onClose}
                />
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl z-50 max-w-sm w-full mx-4 relative"
                >
                    <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                        {title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                        {message}
                    </p>
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                            Confirmar
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmationModal;
