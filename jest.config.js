/** @type {import('jest').Config} */
const config = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1', // alias z tsconfig
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

module.exports = config;