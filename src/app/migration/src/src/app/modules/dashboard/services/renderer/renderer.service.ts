import { Injectable } from '@angular/core';
import { LineChartService } from './../chartjs';
import { DashboardData } from './../../interfaces';

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
   * @param {DashboardData} data data
   * @param {string}        chartType chart type
   */
  visualizer(data: DashboardData, chartType: string) {
    switch (chartType) {
      case 'line':
        return this.lineChartService.parseLineChart(data);
    }
  }
}
