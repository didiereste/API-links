module.exports = {
    testEnviroment: 'node',
    verbose: true,
    collectCoverage: true,
    coverageReporters: ["lcov", "text"],
    coverageDirectory: 'coverage',
    transform: {
        "^.+\\.js$": "babel-jest",
    },
}