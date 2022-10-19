module.exports = {
    transform: {
        '^.+\\.(t|j)sx?$': ['@swc/jest'],
    },
    moduleNameMapper: {
        '\\.(css|less|scss|sss|styl)$':
            '<rootDir>/node_modules/jest-css-modules',
    },
    resolver: `${__dirname}/test/resolver.ts`,
    setupFilesAfterEnv: [`${__dirname}/test/jest-setup.ts`],
};
