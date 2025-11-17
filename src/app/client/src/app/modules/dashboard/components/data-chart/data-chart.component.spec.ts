// Mock Chart.js before any imports that might use it
(global as any).Chart = {
  register: jest.fn(),
  registerables: [],
  defaults: { global: {} }
};
(window as any).Chart = (global as any).Chart;

// Mock ng2-charts module
jest.mock('ng2-charts', () => ({
  BaseChartDirective: jest.fn().mockImplementation(() => ({
    data: null,
    options: null,
    chart: null,
    update: jest.fn(),
    render: jest.fn(),
  })),
  NgChartsModule: jest.fn(),
}));

import { DataChartComponent } from './data-chart.component';
import { mockChartData } from './data-chart.component.spec.data';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { ReportService, UsageService } from '../../services';
import { MatDialog } from '@angular/material/dialog';
import { ResourceService, ToasterService } from '../../../shared';
import { of } from 'rxjs/internal/observable/of';

describe('DataChartComponent', () => {
    let component: DataChartComponent;
    const mockResourceService: Partial<ResourceService> = {
        messages: {
            emsg: {
                'm0005': 'Something went wrong, please try in some time....'
            },
            imsg: {
                'm0022': 'Stats for last 7 days',
                'm0044': 'Download failed!',
                'm0043': 'Your profile does not have a valid email ID.Please update your email ID',
                'm0045': 'No data available to download'
            },
            stmsg: {
                'm0132': 'We have received your download request. The file will be sent to your registered email ID shortly.',
                'm0141': 'Data unavailable to generate Score Report'
            },
            fmsg: {
                'm0004': 'Could not fetch data, try again later'
            }
        },
        frmelmnts: {
            'instn': {
                't0056': 'Please try again..'
            }
        }
    };
    const mockToasterService: Partial<ToasterService> = {
        warning: jest.fn(),
        error: jest.fn()
    };
    const mockChangeDetectorRef: Partial<ChangeDetectorRef> = {};
    const mockActivatedRoute: Partial<ActivatedRoute> = {
        snapshot: {
            queryParams: {
                selectedTab: 'course'
            },
            data: {
                sendUtmParams: true
            }
        } as any,
        queryParams: of({ batchIdentifier: '0124963192947507200', timePeriod: '7d' }),
    };
    const mockDomSanitizer: Partial<DomSanitizer> = {};
    const mockUsageService: Partial<UsageService> = {
        getData: jest.fn(() => of()),
    };
    const mockReportService: Partial<ReportService> = {};
    const mockDialog: Partial<MatDialog> = {};
    beforeAll(() => {
        component = new DataChartComponent(
            mockResourceService as ResourceService,
            mockChangeDetectorRef as ChangeDetectorRef,
            mockToasterService as ToasterService,
            mockActivatedRoute as ActivatedRoute,
            mockDomSanitizer as DomSanitizer,
            mockUsageService as UsageService,
            mockReportService as ReportService,
            mockDialog as MatDialog
        )
    });
    beforeEach(() => {
        // jest.clearAllMocks();
        component.chartInfo = mockChartData.chartConfig;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should prepare chart from the input chart config', () => {
        jest.spyOn(component, 'getDataSetValue').mockImplementation(() => { });
        component.chartInfo = mockChartData.chartConfig;
        mockChangeDetectorRef.detectChanges = jest.fn();
        component.ngOnInit();
        expect(component.legend).toBe(true);
        expect(component.chartLabels).toEqual([]);
    });

    describe('checkForStacking function', () => {
        let mockchartOptions;
        beforeEach(() => {
            mockchartOptions = {
                scales: {
                    xAxes: [{
                        stacked: true
                    }],
                    yAxes: [{
                        stacked: true
                    }]
                }
            };
            component.chartOptions = mockchartOptions;
        });

        it('should return false is stacking is not enabled in bar chart ', () => {
            component.chartType = 'bar';
            component.chartOptions.scales.xAxes = [{}];
            const result = component.checkForStacking();
            expect(result).toBeDefined();
            expect(result).toBeFalsy();

        });

        it('should return true is stacking is enabled in bar chart ', () => {
            component.chartType = 'bar';
            const result = component.checkForStacking();
            expect(result).toBeDefined();
            expect(result).toBeTruthy();
        });

        it('should return true is stacking is enabled for y axis in line chart', () => {
            component.chartType = 'line';
            const result = component.checkForStacking();
            expect(result).toBeDefined();
            expect(result).toBeTruthy();
        });

        it('should return false for all charts except bar or line', () => {
            component.chartType = 'pie';
            const result = component.checkForStacking();
            expect(result).toBeDefined();
            expect(result).toBeFalsy();
        });
    });

    it('should set labels from datasets', () => {
        component['setChartLabels']({ name: 2 });
        expect(component.chartLabels).toEqual(['Name']);
    });

    it('should set labels from if present in the config (hard coded labels)', () => {
        component['chartConfig'] = {};
        component.chartConfig.labels = ['test'];
        component['setChartLabels']({ name: 2 });
        expect(component.chartLabels).toEqual(['Test']);
    });

    it('should fill chart data with goal value', () => {
        const input = [1, 2, 3];
        const goalValue = 22;
        const result = component['getGoalsDataset'](input, goalValue);
        expect(result).toBeDefined();
        expect(result).toEqual([22, 22, 22]);
    });

    it('should sort data in ascending order based on key', () => {
        const inputData = [{ slug: 'ap' }, { slug: 'rj' }, { slug: 'gj' }];
        const key = 'slug';
        const result = component['sortData'](inputData, key);
        expect(result).toBeDefined();
        expect(result).toEqual([{ slug: 'ap' }, { slug: 'gj' }, { slug: 'rj' }]);
    });


    it('should change the filter and chart type', () => {
        component['chartData'] = {
            selectedFilters: {}
        };
        component.filterChanged({
            chartType: mockChartData.chartConfig.chartType,
            chartData: mockChartData.chartData,
            filters: mockChartData.chartConfig.filters
        });
        expect(component.chartType).toEqual(mockChartData.chartConfig.chartType);
    });

    it('should check show stats', () => {
        component.ngOnInit();
        component.graphStatsChange(false);
        expect(component.showStats).toEqual(false);
    });

    it('should change chart type', () => {
        component.ngOnInit();
        component.changeChartType({
            value: 'bar'
        });
        expect(component.chartType).toEqual('bar');
    });

    it('should open modal popup', () => {
        component.ngOnInit();
        component['chartData'] = {
            selectedFilters: {}
        };
        component.currentFilters = [];
        component.filterModalPopup(true);
        expect(component.chartData['selectedFilters']).toEqual([]);
    });

    it('should check checkFilterReferance', () => {
        component.ngOnInit();
        component.dateFilters = ['date'];
        const response = component.checkFilterReferance('date');
        expect(response).toEqual(true);
    });

    it('should sort data in ascending order based on Date key', () => {
        const inputData = [{ slug: 'ap', date: '01-01-2018' }, { slug: 'rj', date: '01-02-2018' }, { slug: 'gj', date: '01-01-2017' }];
        const key = 'date';
        const result = component['sortData'](inputData, key);
        expect(result).toBeDefined();
        expect(result).toEqual([{ slug: 'gj', date: '01-01-2017' }, { slug: 'ap', date: '01-01-2018' },
        { slug: 'rj', date: '01-02-2018' }]);
    });

    it('should resetForm', () => {
        component['chartData'] = {};
        component.resetForm();
        expect(component.chartData['selectedFilters']).toEqual({});
        expect(component.currentFilters).toEqual([]);
    });

    it('should destroy sub', () => {
        component.unsubscribe = {
            next: jest.fn(),
            complete: jest.fn()
        } as any;
        component.ngOnDestroy();
        expect(component.unsubscribe.next).toHaveBeenCalled();
        expect(component.unsubscribe.complete).toHaveBeenCalled();
    });

});
