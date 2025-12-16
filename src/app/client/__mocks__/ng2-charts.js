// Mock ng2-charts module for Jest tests
module.exports = {
  BaseChartDirective: class MockBaseChartDirective {
    constructor() {
      this.data = null;
      this.options = null;
      this.chart = null;
      this.update = jest.fn();
      this.render = jest.fn();
    }
  },
  NgChartsModule: class MockNgChartsModule {},
  Chart: {
    register: jest.fn(),
    registerables: [],
    defaults: { global: {} }
  }
};