import { DashboardModule } from '@sunbird/dashboard';
import { CoreModule } from '@sunbird/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule } from '@sunbird/shared';
import { ChartsModule } from 'ng2-charts';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DataChartComponent } from './data-chart.component';
import { SuiModule } from 'ng2-semantic-ui';
import { ReactiveFormsModule } from '@angular/forms';
import { mockChartData } from './data-chart.component.spec.data';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { By } from '@angular/platform-browser';
import { TelemetryModule } from '@sunbird/telemetry';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReportService } from '../../services';
import { configureTestSuite } from '@sunbird/test-util';

describe('DataChartComponent', () => {
    let component: DataChartComponent;
    let fixture: ComponentFixture<DataChartComponent>;
    configureTestSuite();
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [ChartsModule, SuiModule, ReactiveFormsModule, SharedModule.forRoot(), HttpClientTestingModule,
                NgxDaterangepickerMd.forRoot(), TelemetryModule.forRoot(), RouterTestingModule, CoreModule, DashboardModule],
            providers: [ReportService, {
                provide: ActivatedRoute, useValue: {
                    snapshot: {
                        params: {
                            reportId: '123'
                        },
                        data: {
                            telemetry: { env: 'dashboard', pageid: 'org-admin-dashboard', type: 'view' }
                        }
                    }
                }
            }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataChartComponent);
        component = fixture.componentInstance;
        component.chartInfo = mockChartData;
        fixture.detectChanges();
    });

    afterEach(() => {
        component.ngOnDestroy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should have chartConfig and chartData as input', () => {
        component.ngOnInit();
        expect(component.chartConfig).toBe(mockChartData.chartConfig);
        expect(component.chartData).toBe(mockChartData.chartData);
    });

    it('should prepare chart from the input chart config', () => {
        const spy = spyOn(component, 'getDataSetValue').and.callThrough();
        component.ngOnInit();
        expect(component.chartOptions).toBe(mockChartData.chartConfig.options);
        expect(component.chartColors).toBe(mockChartData.chartConfig.colors);
        expect(component.chartType).toBe(mockChartData.chartConfig.chartType);
        expect(component.legend).toBe(true);
        expect(component.filters).toBe(mockChartData.chartConfig.filters);
        expect(spy).toHaveBeenCalled();
        expect(component.chartLabels).toEqual([
            'Class 1',
            'Class 2',
            'Class 3',
            'Class 4',
            'Class 5',
            'Class 6',
            'Class 7',
            'Class 8',
            'Class 9',
            'Class 10'
        ]);
        expect(component.datasets[0].data).toEqual(
            [
                115,
                1158,
                3532,
                980,
                984,
                717,
                737,
                208,
                819,
                750
            ]
        );

        expect(component.resultStatistics).toEqual({
            'Total number of QR codes': {
                'sum': '10000.00',
                'min': 115,
                'max': 3532,
                'avg': '1000.00'
            }
        });
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


    it('should change the filter and chart type', fakeAsync(() => {
        component.ngOnInit();
        tick(1000);
        component.filterChanged({
            chartType: mockChartData.chartConfig.chartType,
            chartData: mockChartData.chartData,
            filters: mockChartData.chartConfig.filters
        });
        expect(component.chartType).toEqual(mockChartData.chartConfig.chartType);
    }));

    it('should check show stats', fakeAsync(() => {
        component.ngOnInit();
        tick(1000);
        component.graphStatsChange(false);
        expect(component.showStats).toEqual(false);
    }));
    it('should change chart type', fakeAsync(() => {
        component.ngOnInit();
        tick(1000);
        component.changeChartType('bar');
        expect(component.chartType).toEqual('bar');
    }));

    it('should close popup', fakeAsync(() => {
        component.ngOnInit();
        tick(1000);
        component.filterModalPopup(false);
        expect(component.filterPopup).toEqual(false);
    }));

    it('should open modal popup', fakeAsync(() => {
        component.ngOnInit();
        tick(1000);
        component.filterModalPopup(true);
        expect(component.filterPopup).toEqual(true);
    }));

    it('should check checkFilterReferance', fakeAsync(() => {
        component.ngOnInit();
        tick(1000);
        component.dateFilters = ['date'];
        const response = component.checkFilterReferance("date");
        expect(response).toEqual(true);
    }));

    it('should set globalFilter', fakeAsync(() => {
        component.ngOnInit();
        tick(1000);
        component.globalFilter = { chartData: mockChartData.chartData };
        expect(component.chartData).toEqual(mockChartData.chartData);

    }));

    it('should sort data in ascending order based on Date key', () => {
        const inputData = [{ slug: 'ap', date: '01-01-2018' }, { slug: 'rj', date: '01-02-2018' }, { slug: 'gj', date: '01-01-2017' }];
        const key = 'date';
        const result = component['sortData'](inputData, key);
        expect(result).toBeDefined();
        expect(result).toEqual([{ slug: 'gj', date: '01-01-2017' }, { slug: 'ap', date: '01-01-2018' },
        { slug: 'rj', date: '01-02-2018' }]);
    });

});
