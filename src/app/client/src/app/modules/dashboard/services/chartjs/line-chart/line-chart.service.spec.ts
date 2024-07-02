import { LineChartService } from './line-chart.service';
import * as _ from 'lodash-es';

const mockDashboardData = {
  bucketData: {
    bucket1: {
      name: 'Bucket 1',
      time_unit: 'days',
      buckets: [
        { key_name: 'Label 1', value: 10 },
        { key_name: 'Label 2', value: 20 },
      ],
    },
  },
  name: 'Data Name',
  series: '',
};

describe('LineChartService', () => {
  let lineChartService;

  beforeEach(() => {
    lineChartService = new LineChartService();
  });

  it('should parse line chart data correctly', () => {
    const result = lineChartService.parseLineChart(mockDashboardData);
    expect(result).toEqual([
      {
        yaxesData: [
          {
            data: [10, 20],
            label: 'Bucket 1',
          },
        ],
        xaxesData: ['Label 1', 'Label 2'],
        chartOptions: {
          legend: { display: true },
          scales: {
            xAxes: [{ gridLines: { display: false } }],
            yAxes: [
              {
                scaleLabel: { display: true, labelString: 'Bucket 1 (days)' },
                ticks: { beginAtZero: true },
              },
            ],
          },
        },
        chartColors: [
          {
            backgroundColor: 'Red',
            borderColor: 'Red',
            fill: false,
          },
        ],
      },
    ]);
  });

  it('should return correct line chart data', () => {
    const bucketData = {
      buckets: [
        { key_name: 'Label 1', value: 10 },
        { key_name: 'Label 2', value: 20 },
      ],
    };

    const result = lineChartService.getLineData(bucketData);

    const expected = {
      labels: ['Label 1', 'Label 2'],
      values: [10, 20],
    };

    expect(result).toEqual(expected);
  });

  it('should return correct chart options', () => {
    const labelString = 'Test Label';
    const result = lineChartService.getChartOption(labelString);
    const expected = {
      legend: { display: true },
      scales: {
        xAxes: [{ gridLines: { display: false } }],
        yAxes: [
          {
            scaleLabel: { display: true, labelString: 'Test Label' },
            ticks: { beginAtZero: true },
          },
        ],
      },
    };

    expect(result).toEqual(expected);
  });

  it('should handle legend and yAxesLabel when data.series is not empty', () => {
    const data = {
      bucketData: {
        key1: {
          name: 'Bucket 1',
          time_unit: 'hours',
          buckets: [
            { key_name: 'Label 1', value: 10 },
            { key_name: 'Label 2', value: 20 },
          ],
        },
      },
      name: 'Test Name',
      series: ['Series 1'],
    };

    const result = lineChartService.parseLineChart(data);
    const expected = [
      {
        yaxesData: [
          {
            data: [10, 20],
            label: 'Series 1',
          },
        ],
        xaxesData: ['Label 1', 'Label 2'],
        chartOptions: {
          legend: { display: true },
          scales: {
            xAxes: [{ gridLines: { display: false } }],
            yAxes: [
              {
                scaleLabel: { display: true, labelString: 'Test Name' },
                ticks: { beginAtZero: true },
              },
            ],
          },
        },
        chartColors: [
          {
            backgroundColor: 'Red',
            borderColor: 'Red',
            fill: false,
          },
        ],
      },
    ];

    expect(result).toEqual(expected);
  });

});
