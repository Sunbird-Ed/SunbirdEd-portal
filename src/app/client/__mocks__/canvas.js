// Mock for canvas module to prevent native bindings issues in Jest tests
module.exports = {
  createCanvas: jest.fn(() => ({
    getContext: jest.fn(() => ({
      fillRect: jest.fn(),
      drawImage: jest.fn(),
      getImageData: jest.fn(),
      putImageData: jest.fn(),
      createImageData: jest.fn(),
      setTransform: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      translate: jest.fn(),
      transform: jest.fn(),
      resetTransform: jest.fn(),
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
      strokeStyle: '#000000',
      fillStyle: '#000000',
      lineWidth: 1,
      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 10,
      font: '10px sans-serif',
      textAlign: 'start',
      textBaseline: 'alphabetic'
    })),
    width: 300,
    height: 150,
    toDataURL: jest.fn(() => 'data:image/png;base64,'),
    toBuffer: jest.fn(() => Buffer.alloc(0))
  })),
  loadImage: jest.fn(() => Promise.resolve({
    width: 100,
    height: 100
  })),
  registerFont: jest.fn(),
  parseFont: jest.fn(),
  DOMMatrix: class MockDOMMatrix {
    constructor() {
      this.a = 1; this.b = 0; this.c = 0; this.d = 1; this.e = 0; this.f = 0;
    }
  },
  DOMPoint: class MockDOMPoint {
    constructor(x = 0, y = 0, z = 0, w = 1) {
      this.x = x; this.y = y; this.z = z; this.w = w;
    }
  }
};