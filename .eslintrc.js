const path = require('path')
/**  @type {import('eslint').Linter.Config} */
module.exports = {
    env: {
        node: true,
        browser: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:import/typescript', 'prettier'],
    ignorePatterns: ['*.d.ts', '.eslintrc.js', 'jest.config.js'],
    plugins: ['@typescript-eslint', 'import', 'unused-imports'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: path.join(__dirname, 'tsconfig.eslint.json'),
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
                project: path.join(__dirname, 'tsconfig.eslint.json'),
            },
        },
    },
    rules: {
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-namespace': 'off',
        'unused-imports/no-unused-imports': 'error',
        'unused-imports/no-unused-vars': [
            'warn',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'all',
                argsIgnorePattern: '^_',
            },
        ],
        'import/order': [
            'error',
            {
                alphabetize: {
                    order: 'asc',
                },
                groups: [['builtin', 'external', 'internal'], ['parent', 'sibling', 'index'], ['object']],
                'newlines-between': 'always',
            },
        ],
    },
}
