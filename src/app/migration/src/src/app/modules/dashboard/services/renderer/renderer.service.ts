import { Injectable } from '@angular/core';
import { LineChartService } from './graphs/line-chart.service';
import { ChartData } from './../../index';


/**
 * Responsible to get chart data
 */
@Injectable()

/**
 * @class RendererService
 */
export class RendererService {

  /**
 * Default method of OrganisationService class
   *
   * @param lineChartService
   */
  constructor(private lineChartService: LineChartService) { }

  /**
   * Based on chart type call chart service
   *
   * Currently, it supports only line chart
   *
   * @param data ChartData chart data
   * @param chartType chart type
   */
  visualizer(data: ChartData, chartType: string) {
    switch (chartType) {
      case 'line':
        return this.lineChartService.parseLineChart(data);
    }
  }
}
