// eslint.config.js

import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Configurações base para todos os arquivos
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      parser: "@typescript-eslint/parser", // Parser para arquivos TypeScript
      globals: globals.browser, // Adiciona os globais do navegador
    },
    rules: {
      // Permite JSX sem precisar importar React no escopo
      "react/react-in-jsx-scope": "off",

      // Permite variáveis não usadas, mas avisa (emite warning)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_", // Ignora argumentos iniciados com "_"
          varsIgnorePattern: "^_", // Ignora variáveis iniciadas com "_"
        },
      ],

      // Desativa validações de PropTypes no React (opcional para TypeScript)
      "react/prop-types": "off",
    },
  },

  // Configurações recomendadas pelo ESLint
  pluginJs.configs.recommended,

  // Configurações recomendadas do @typescript-eslint
  ...tseslint.configs.recommended,

  // Configurações recomendadas do eslint-plugin-react
  pluginReact.configs.flat.recommended,
];
