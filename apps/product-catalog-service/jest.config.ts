export default {
  displayName: 'product-catalog-service',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/apps/product-catalog-service',
  roots: ['<rootDir>', '<rootDir>/../../tests/units/product-catalog-service'],
};
