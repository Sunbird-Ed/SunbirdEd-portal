import { TestBed, inject } from '@angular/core/testing';
import { LineChartService } from './line-chart.service';
import * as _ from 'lodash';

// Test data
import * as mockData from './line-chart.service.spec.data';
const testData = <any>mockData.mockRes;

describe('LineChartService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LineChartService]
    });
  });

  it('should be created', inject([LineChartService], (service: LineChartService) => {
    expect(service).toBeTruthy();
  }));

  it('should render conumption line chart', inject([LineChartService],
    (service: LineChartService) => {
      spyOn(service, 'parseLineChart').and.callThrough();
      spyOn(service, 'getChartColors').and.callThrough();
      const response = service.parseLineChart(testData.consumptionData);
      expect(service).toBeTruthy();
      expect(service.getChartColors).toHaveBeenCalled();
      expect(response.length).not.toBe(0);

      for (let i = 0; i < response.length; i++ ) {
        expect(response[i].yaxesData).not.toBeUndefined();
        expect(response[i].yaxesData.length).not.toBe(0);
        expect(response[i].xaxesData).not.toBeUndefined();
        expect(response[i].chartOptions).toBeDefined();
        expect(response[i].chartOptions.length).not.toBe(0);
      }
  }));

  it('should render creation line chart', inject([LineChartService],
    (service: LineChartService) => {
      spyOn(service, 'parseLineChart').and.callThrough();
      spyOn(service, 'getChartColors').and.callThrough();
      const response = service.parseLineChart(testData.creationData);
      expect(service).toBeTruthy();
      expect(service.getChartColors).toHaveBeenCalled();
      expect(response.length).not.toBe(0);

      for (let i = 0; i < response.length; i++ ) {
        expect(response[i].yaxesData).not.toBeUndefined();
        expect(response[i].yaxesData.length).not.toBe(0);
        expect(response[i].xaxesData).not.toBeUndefined();
        expect(response[i].chartOptions).toBeDefined();
        expect(response[i].chartOptions.length).not.toBe(0);
      }
  }));

  it('should return chart option', inject([LineChartService],
    (service: LineChartService) => {
      spyOn(service, 'getChartOption').and.callThrough();
      const i = 0;
      const lable = 'Content created per day';
      const response = service.getChartOption(lable);
      expect(response.legend.display).toEqual(true);
      // X-axes option
      expect(response.scales.xAxes[i].gridLines.display).toEqual(false);
      // Y-axes option
      expect(response.scales.yAxes[i].scaleLabel.display).toEqual(true);
      expect(response.scales.yAxes[i].scaleLabel.labelString === lable).toBe(true);
      // Y-axes: graph begin at zero
      expect(response.scales.yAxes[i].ticks.beginAtZero).toEqual(true);
  }));

  it('should return chart color', inject([LineChartService],
    (service: LineChartService) => {
      spyOn(service, 'getChartColors').and.callThrough();
      spyOn(service, 'getRandomColor').and.callThrough();
      const colors = service.getChartColors(1);
      expect(service.getRandomColor).toHaveBeenCalled();
      expect(colors.length).toEqual(1);
  }));
});

