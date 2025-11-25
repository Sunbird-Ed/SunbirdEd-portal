// import { jest } from '@jest/globals';

// Object.defineProperty(window, 'CSS', { value: null });

// Object.defineProperty(window, 'EkTelemetry', { value: {} });

// Object.defineProperty(document, 'doctype', {
//   value: '<!DOCTYPE html>',
// });

// Object.defineProperty(window, 'getComputedStyle', {
//   value: () => {
//     return {
//       display: 'none',
//       appearance: ['-webkit-appearance'],
//     };
//   },
// });

// /**
//  * ISSUE: https://github.com/angular/material2/issues/7101
//  * Workaround for JSDOM missing transform property
//  */
// Object.defineProperty(document.body.style, 'transform', {
//   value: () => {
//     return {
//       enumerable: true,
//       configurable: true,
//     };
//   },
// });

// HTMLCanvasElement.prototype.getContext = <typeof HTMLCanvasElement.prototype.getContext>jest.fn();
import { jest } from '@jest/globals';

Object.defineProperty(window, 'CSS', { value: null });

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
});

Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance'],
    };
  },
});

/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true,
    };
  },
});

HTMLCanvasElement.prototype.getContext = <typeof HTMLCanvasElement.prototype.getContext>jest.fn();

// Polyfill for TextEncoder and TextDecoder (if not already set)
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Polyfill for crypto.randomUUID if needed
if (!global.crypto) {
  global.crypto = {
    randomUUID: jest.fn(() => '00000000-0000-0000-0000-000000000000'),
    getRandomValues: jest.fn((arr) => arr)
  } as any;
}

// Ensure util is available for Node.js polyfills
const util = require('util');
if (!(global as any).util) {
  (global as any).util = util;
}