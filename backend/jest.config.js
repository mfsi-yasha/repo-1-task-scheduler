module.exports = {
	verbose: true,
	preset: "ts-jest",
	testEnvironment: "node",
	modulePathIgnorePatterns: ["<rootDir>/dist/"],
	moduleNameMapper: {
		"^src/(.*)$": "<rootDir>/src/$1", // Resolve the alias for `src/*`
	},
	setupFiles: ["<rootDir>/jest.setup.js"],
};
