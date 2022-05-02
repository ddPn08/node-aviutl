/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    globals: {
        'ts-jest': {
            tsconfig: 'tsconfig.jest.json',
        },
    },
}
