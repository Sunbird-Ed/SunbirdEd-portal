// Mock for jsonld to avoid @digitalbazaar/http-client loading in tests

module.exports = {
  compact: jest.fn().mockResolvedValue({}),
  expand: jest.fn().mockResolvedValue([]),
  flatten: jest.fn().mockResolvedValue([]),
  frame: jest.fn().mockResolvedValue({}),
  fromRDF: jest.fn().mockResolvedValue({}),
  normalize: jest.fn().mockResolvedValue(''),
  toRDF: jest.fn().mockResolvedValue(''),
  __esModule: true,
  default: {
    compact: jest.fn().mockResolvedValue({}),
    expand: jest.fn().mockResolvedValue([]),
    flatten: jest.fn().mockResolvedValue([]),
    frame: jest.fn().mockResolvedValue({}),
    fromRDF: jest.fn().mockResolvedValue({}),
    normalize: jest.fn().mockResolvedValue(''),
    toRDF: jest.fn().mockResolvedValue(''),
  }
};