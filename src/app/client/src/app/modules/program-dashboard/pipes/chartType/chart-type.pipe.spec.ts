import { ChartTypePipe } from "./chart-type.pipe";
import { mockChart } from "./chart-type.pipe.spec.data";

describe("ChartTypePipe", () => {
  let chartPipe: ChartTypePipe;

  beforeAll(() => {
    chartPipe = new ChartTypePipe();
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create an instance", () => {
    expect(chartPipe).toBeTruthy();
  });

  it("should transform the chart data", () => {
    let transformedBigData = chartPipe.transform(mockChart.chartData);
    expect(transformedBigData).toEqual({ values: mockChart.chartData });
  });

  it("should transform the chart config", () => {
    let transformedBigData = chartPipe.transform(mockChart.chartConfig);
    expect(transformedBigData).toEqual(mockChart.transformedConfig);
  });
});
