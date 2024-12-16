// components/Footer.tsx
import React from 'react';
import { FaInstagram, FaWhatsapp, FaGithub } from 'react-icons/fa';
import Link from 'next/link';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-gray-800 shadow-md mt-auto py-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row justify-between items-center text-sm">
                    <p className="text-gray-600 dark:text-gray-400 mb-2 sm:mb-0">
                        © {new Date().getFullYear()} Taxas Guarapari. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center space-x-3">
                        <span className="text-gray-600 dark:text-gray-400">
                            Feito com ❤️ por Rafael
                        </span>
                        <Link href="https://github.com/gabrielsoaresdev"  target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300">
                            <FaGithub  size={20} />
                        </Link>
                        <Link href="https://www.instagram.com/raffinhasanto" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors duration-300">
                            <FaInstagram color={'#e1306c'} size={20} />
                        </Link>
                        <Link href="https://wa.me/27999846927" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors duration-300">
                            <FaWhatsapp color={'#25D366'} size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
