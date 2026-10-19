import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import prettier from 'eslint-plugin-prettier'

const termsFeatureFiles = [
  'src/components/admin/payments/TermsExportButton.tsx',
  'src/components/admin/payments/TransactionDetailsDrawer.tsx',
  'src/components/checkout/TermsAcceptance.tsx',
  'src/components/checkout/TermsReceiptModal.tsx',
  'src/components/home/PaymentSafetyBanner.tsx',
  'src/constants/terms.ts',
  'src/pages/admin/AdminPaymentsPage.tsx',
  'src/pages/dashboard/OrderDetailPage.tsx',
  'src/pages/public/CheckoutPage.tsx',
  'src/pages/public/TermsPage.tsx',
  'src/services/marketplace/order.service.ts',
]

export default tseslint.config(
  { ignores: ['dist', 'node_modules_old', 'supabase/**', '**/*.js', '**/*.cjs', '**/*.mjs'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: termsFeatureFiles,
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['src/constants/terms.ts'],
    rules: {
      'prettier/prettier': 'off',
    },
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['tests/terms-acceptance.test.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  }
)