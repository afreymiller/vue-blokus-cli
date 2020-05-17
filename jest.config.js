module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{js,jsx,vue}",
    "!**/node_modules/**",
    "!**/vendor/**",
    "!**/coverage/**",
    "!**/jest.config.js",
    "!**/babel.config.js",
    "!**/src/helpers/canvasApi.js",
    "!**/src/helpers/matrixTransformApi.js",
    "!**/tests/**"
  ]
}
