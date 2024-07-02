import { DashboardUtilsService } from './dashboard-utils.service';

jest.mock('dayjs', () => {
  const dayjs = jest.requireActual('dayjs');
  dayjs.extend(require('dayjs/plugin/duration'));
  return dayjs;
});

describe('DashboardUtilsService', () => {
  let dashboardUtilsService: DashboardUtilsService;

  beforeEach(() => {
    dashboardUtilsService = new DashboardUtilsService();
  });

  it('should create the service', () => {
    expect(dashboardUtilsService).toBeTruthy();
  });

  describe('secondToMinConversion', () => {
    it('should convert seconds to minutes', () => {
      const numericData = { value: 120 };
      const result = dashboardUtilsService.secondToMinConversion(numericData);
      expect(result.value).toBe('2 minute');
    });

    it('should not convert seconds if less than 60', () => {
      const numericData = { value: 30 }; // 30 seconds
      const result = dashboardUtilsService.secondToMinConversion(numericData);
      expect(result.value).toBe('30 Second');
    });

    it('should format numericData value when value is less than 60 seconds', () => {
      const numericData = { value: 45 };
      const result = dashboardUtilsService.secondToMinConversion(numericData);
      expect(result.value).toEqual('45 Second');
    });

    it('should format numericData value when value is between 60 and 3600 seconds', () => {
      const numericData = { value: 1500 };
      const result = dashboardUtilsService.secondToMinConversion(numericData);
      expect(result.value).toEqual('25 minute');
    });


    it('should format numericData value when value is greater than or equal to 3600 seconds', () => {
      const numericData = { value: 4000 };
      const result = dashboardUtilsService.secondToMinConversion(numericData);
      expect(result.value).toEqual('undefined Hour');
    });

    it('should return numericData unchanged when value is not in the specified ranges', () => {
      const numericData = { value: 30 };
      const result = dashboardUtilsService.secondToMinConversion(numericData);
      expect(result.value).toEqual('30 Second');
    });
  });
});
