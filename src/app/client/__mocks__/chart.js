// Mock Chart.js module for Jest tests
module.exports = {
  Chart: {
    register: jest.fn(),
    registerables: [],
    defaults: { global: {} }
  },
  registerables: [],
  CategoryScale: jest.fn(),
  LinearScale: jest.fn(),
  BarElement: jest.fn(),
  Title: jest.fn(),
  Tooltip: jest.fn(),
  Legend: jest.fn(),
  PointElement: jest.fn(),
  LineElement: jest.fn(),
  Filler: jest.fn(),
  ArcElement: jest.fn(),
};