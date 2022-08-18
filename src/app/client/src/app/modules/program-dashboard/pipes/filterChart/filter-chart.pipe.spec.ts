import { FilterChartPipe } from './filter-chart.pipe';
import { mockFilterData } from './filter-chart.pipe.spec.data'

describe('FilterChartPipe', () => {
  let filterPipe:FilterChartPipe;

  beforeAll(() => {
    filterPipe = new FilterChartPipe();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create an instance', () => {
    expect(filterPipe).toBeTruthy();
  });

  it("should transform the chart data to filterable data", () => {
    let transformedBigData = filterPipe.transform(mockFilterData.configId,mockFilterData.chartData,mockFilterData.currentFilters);
    expect(transformedBigData).toEqual(mockFilterData.transformedFilter);
  });

});
