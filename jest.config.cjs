module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.(spec|test).ts'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    moduleNameMapper: {
        '^@ornorm/aspectT$': '<rootDir>/src/ornorm/aspectT',
    },
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    reporters: [
        'default',
        ['jest-junit', { outputDirectory: 'reports/junit' }],
        ['jest-html-reporter', { outputPath: 'reports/test-report.html' }]
    ],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
