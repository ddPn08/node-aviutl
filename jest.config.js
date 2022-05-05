/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/test'],
    globals: {
        'ts-jest': {
            useESM: true,
            tsconfig: 'tsconfig.jest.json',
        },
    },
    transform: {
        '\\.[jt]sx?$': 'ts-jest',
    },
    moduleNameMapper: {
        '(.+)\\.js': '$1',
    },
    extensionsToTreatAsEsm: ['.ts'],
}
