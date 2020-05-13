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

describe('DataChartComponent', () => {
    let component: DataChartComponent;
    let fixture: ComponentFixture<DataChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DataChartComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [ChartsModule, SuiModule, ReactiveFormsModule, SharedModule.forRoot(), HttpClientTestingModule,
                NgxDaterangepickerMd.forRoot(), TelemetryModule.forRoot(), RouterTestingModule, CoreModule],
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
            'Class 2',
            'Class 3',
            'Class 4',
            'Class 5',
            'Class 6',
            'Class 7',
            'Class 8',
            'Class 9',
            'Class 10',
            'Class 1'
        ]);
        expect(component.datasets).toEqual([{
            label: 'Total number of QR codes',
            data: [
                1158,
                3532,
                980,
                984,
                717,
                737,
                208,
                819,
                750,
                115
            ],
            hidden: false
        }]);

        expect(component.resultStatistics).toEqual({
            'Total number of QR codes': {
                'sum': '10000.00',
                'min': 115,
                'max': 3532,
                'avg': '1000.00'
            }
        });
    });

    it('should build filters form from the configuration', () => {
        const spy = spyOn(component, 'buildFiltersForm').and.callThrough();
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(component.filtersFormGroup.contains('Medium')).toBe(true);
        expect(component.filtersFormGroup.contains('Grade')).toBe(true);
        expect(component.filtersFormGroup.contains('Textbook name')).toBe(true);
        expect(component.filtersFormGroup.controls).toBeTruthy();
    });

    it('should should change selected filters value whenever any filter is changed', fakeAsync(() => {
        const spy = spyOn(component, 'getDataSetValue').and.callThrough();
        component.ngOnInit();
        component.filtersFormGroup.get('Grade').setValue(['Class 2']);
        component.filtersFormGroup.get('Medium').setValue(['telugu']);
        tick(1000);
        expect(component.selectedFilters).toEqual({
            'Grade': ['Class 2'],
            'Medium': ['telugu']
        });
        expect(spy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalledWith([{
            'Textbook ID': 'do_312526681781231616143581',
            'Medium': 'Telugu',
            'Grade': 'Class 2',
            'Subject': 'English',
            'Textbook name': 'TEL_MY_English_BOOK_STD_2ND',
            'Total number of QR codes': '70',
            'Number of QR codes with atleast 1 linked content': '64',
            'Number of QR codes with no linked content': '6'
        }, {
            'Textbook ID': 'do_312528209599135744252700',
            'Medium': 'Telugu',
            'Grade': 'Class 2',
            'Subject': 'Mathematics',
            'Textbook name': 'Tel_mathematics_std_2nd',
            'Total number of QR codes': '65',
            'Number of QR codes with atleast 1 linked content': '5',
            'Number of QR codes with no linked content': '60'
        }]);
        expect(component.noResultsFound).toBe(false);
        expect(component.chartLabels).toEqual(['Class 2']);
        expect(component.datasets).toEqual([{
            label: 'Total number of QR codes',
            data: [135],
            hidden: false
        }]);
    }));

    it('should reset the filters on click of reset button', () => {
        const spy = spyOn(component, 'resetFilter').and.callThrough();
        const resetButton = fixture.debugElement.query(By.css('.sb-btn.sb-btn-outline-primary.sb-btn-normal'));
        resetButton.triggerEventHandler('click', null);
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    });

    xit('should set the dateRange', fakeAsync(() => {
        component.ngOnInit();
        tick(1000);
        component.getDateRange({
            startDate: 'Tue Jan 08 2019 00:00:00 GMT+0530 (India Standard Time)',
            endDate: 'Tue Jan 10 2019 00:00:00 GMT+0530 (India Standard Time)'
        }, 'Grade');
        tick(1000);
        expect(component.filtersFormGroup.get('Grade').value).toEqual(['08-01-2019', '09-01-2019', '10-01-2019']);
    }));

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

});
