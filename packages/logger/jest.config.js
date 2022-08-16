module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/'],
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.jsx?$': 'babel-jest', // Adding this line solved the issue
    '^.+\\.tsx?$': 'ts-jest'
  }
}
