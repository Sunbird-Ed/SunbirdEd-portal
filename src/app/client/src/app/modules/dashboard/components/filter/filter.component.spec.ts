
import { FilterComponent } from './filter.component';
import { mockChartData } from './filter.component.spec.data';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ResourceService } from '../../../shared';
import { fakeAsync, tick } from '@angular/core/testing';

describe('FilterComponent', () => {
  let component: FilterComponent;

  const mockResourceService: Partial<ResourceService> = {
    messages: {
      imsg: {
        reportSummaryAdded: 'Summary Added Successfully',
        reportPublished: 'Report Published Successfully',
        reportRetired: 'Report Retired Successfully',
        confirmReportPublish: 'Are you sure you want to publish the report ?',
        confirmRetirePublish: 'Are you sure you want to retire the report ?'
      },
      emsg: {
        m0076: 'No data available to download ',
        m0005: 'Something went wrong, try later'
      },
      stmsg: {
        m0131: 'Could not find any reports',
        m0144: 'You do not have appropriate rights to access this page.'
      }
    },
    frmelmnts: {
      btn: {
        tryagain: 'tryagain',
        close: 'close'
      },
      lbl: {
        reportSummary: 'Report Summary'
      }
    },
    languageSelected$: of({})
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({})
  };
  const mockFormBuilder: Partial<FormBuilder> = {
    group: jest.fn()
  };
  const mockChangeDetectionRef: Partial<ChangeDetectorRef> = {
  };
  const selectedDialogData:Partial<typeof MAT_DIALOG_DATA>={}
  beforeAll(() => {
    component = new FilterComponent(
      mockResourceService as ResourceService,
      mockFormBuilder as FormBuilder,
      mockActivatedRoute as ActivatedRoute,
      mockChangeDetectionRef as ChangeDetectorRef,
      selectedDialogData as typeof MAT_DIALOG_DATA
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    component.filtersFormGroup = new FormBuilder().group({});
    expect(component).toBeTruthy();
  });

  it('should build filters form from the configuration', () => {
    jest.spyOn(component, 'buildFiltersForm').mockImplementation(() => { });
    component.filters = mockChartData.filters;
    component.ngOnInit();
    expect(component.buildFiltersForm).toHaveBeenCalled();
    expect(component.buildFiltersForm).toHaveBeenCalledTimes(1);
    expect(component.filtersFormGroup.contains('state')).toBe(false);
    expect(component.filtersFormGroup.controls).toBeTruthy();
  });

  it('should reset filter', fakeAsync(() => {
    mockChangeDetectionRef.detectChanges = jest.fn();
    component.ngOnInit();
    tick(1000);
    component.resetFilter();
    tick(1000);
    expect(component.showFilters).toEqual(true);
  }));

  it('should check checkFilterReferance', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);
    component.dateFilters = ['date'];
    const response = component.checkFilterReferance('date');
    expect(response).toEqual(true);
  }));

  it('should set resetFilters', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);
    component.resetFilters = { data: [{ data: mockChartData.chartData, id: 'chartId' }], reset: true, filters: mockChartData.filters };
    tick(1000);
    component.resetFilter();
    tick(1000);
    component.buildFiltersForm();
    tick(1000);
    expect(component.chartData).toEqual([{ id: 'chartId', data: mockChartData.chartData }]);
  }));

  it('should run buildFiltersForm', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);
    component.filters = mockChartData.filters;
    component.chartData = [{ data: mockChartData.chartData, id: 'chartId' }];
    tick(1000);
    component.buildFiltersForm();
    tick(1000);
    tick(1000);
    expect(component.selectedFilters).toEqual(null);
  }));

  it('should get filter dat with selected filter', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);
    component.filters = mockChartData.filters;
    component.chartData = [{ data: mockChartData.chartData, id: 'chartId' }];
    tick(1000);
    component.buildFiltersForm();
    tick(1000);
    tick(1000);
    component.filterData();
    expect(component.selectedFilters).toEqual(null);

  }));

  it('should call formUpdate and update the form', fakeAsync(() => {
    component.filtersFormGroup = new FormBuilder().group({
          state: ['1']
        });
    jest.spyOn(component, 'formUpdate');
    component.ngOnInit();
    tick(1000);
    component.filtersFormGroup.get('state').setValue(['01285019302823526477']);
    tick(1000);
    component.filters = mockChartData.filters;
    component.chartData = [{ data: mockChartData.chartData, id: 'chartId' }];
    component.selectedFilters = {"state":['01285019302823526477']};
    component.previousFilters = {"state":['b00bc992ef25f1a9a8d']}
    component.formUpdate(component.chartData)
    expect(component.formUpdate).toHaveBeenCalled();
  }));

  it('should call autoCompleteChange', fakeAsync(() => {
    component.filters = mockChartData.filters;
    component.chartData = [{ data: mockChartData.chartData, id: 'chartId' }];
    component.ngOnInit();
    tick(1000);
    component.autoCompleteChange(['01285019302823526477'], 'state');
    tick(1000);
    expect(component.filtersFormGroup.controls).toBeTruthy();
    expect(component.currentReference).toEqual('state');
  }));

  it('should call getSelectedData', fakeAsync(() => {
    component.filters = mockChartData.filters;
    component.chartData = [{ data: mockChartData.chartData, id: 'chartId' }];
    component.ngOnInit();
    tick(1000);
    component.filtersFormGroup.get('state').setValue(['01285019302823526477']);
    tick(1000);
    const res = component.getSelectedData('state');
    tick(1000);
    expect(component.filtersFormGroup.controls).toBeTruthy();
    expect(res).toEqual(['01285019302823526477']);
    const res2 = component.getSelectedData('state2');
    tick(1000);
    expect(component.filtersFormGroup.controls).toBeTruthy();
    expect(res2).toEqual([]);
  }));

  it('should call getSelectedData', fakeAsync(() => {
    component.filterQuery = 'ab';
    component.chartData = [{ data: mockChartData.chartData, id: 'chartId' }];
    component.ngOnInit();
    tick(1000);
    const res = component.getFilters(['cd', 'ef']);
    tick(1000);
    expect(res).toEqual([]);
    const res2 = component.getFilters(['ab', 'ef']);
    tick(1000);
    expect(res2).toEqual(['ab']);
  }));

  it('should call getSelectedData', () => {
    component.filterQuery = '';
    jest.spyOn(component,'getFilters')
    component.getFilters(['cd', 'ef']);
    expect(component.getFilters).toHaveBeenCalled();
  });

  it('should call formUpdate and update the form with first filter', fakeAsync(() => {
    component.filtersFormGroup = new FormBuilder().group({
          state: ['1']
        });
    jest.spyOn(component, 'formUpdate');
    component.ngOnInit();
    tick(1000);
    component.filtersFormGroup.get('state').setValue(['01285019302823526477']);
    tick(1000);
    component.filters = mockChartData.filters;
    component.chartData = [{ data: mockChartData.chartData, id: 'chartId' }];
    component.firstFilter = 'state';
    component.currentReference = 'state';
    component.selectedFilters = {"state":['01285019302823526477']};
    component.previousFilters = {"state":['b00bc992ef25f1a9a8d']}
    component.formUpdate(component.chartData)
    expect(component.formUpdate).toHaveBeenCalled();
  }));

  it('should call filterData', fakeAsync(() => {
    jest.spyOn(component, 'filterData');
    component.filters = mockChartData.filters;
    component.chartData = [{ data: mockChartData.chartData, 'selectedFilters':{"state":['b00bc992ef25f1a9a8d63291e20efc8d'],"Date": '2020-04-28'}, id: 'chartId' }];
    component.firstFilter = ['state'];
    component.currentReference = 'state';
    component.selectedFilters = {"state":['b00bc992ef25f1a9a8d63291e20efc8d'],"Date": '2020-04-28'};
    component.filterData();
    expect(component.filterData).toHaveBeenCalled();
  }));

  it('should call filterData with prev filter', fakeAsync(() => {
    jest.spyOn(component, 'filterData');
    component.filters = mockChartData.filters;
    component.chartData = [{ data: mockChartData.chartData, id: 'chartId' }];
    component.currentReference = 'state';
    component.selectedFilters = {"Plays":['10']};
    component.filterData();
    expect(component.filterData).toHaveBeenCalled();
  }));

  it('should call filterData without first filter', fakeAsync(() => {
    jest.spyOn(component, 'filterData');
    component.filters = mockChartData.filters;
    component.previousFilters = {};
    component.chartData = [{ data: mockChartData.chartData, id: 'chartId' }];
    component.currentReference = 'state';
    component.selectedFilters = {"Plays":['10']};
    component.filterData();
    expect(component.filterData).toHaveBeenCalled();
  }));

  it('should check checkFilterReferance', fakeAsync(() => {
    component.ngOnInit();
    tick(1000);
    component.dateFilters = null
    const response = component.checkFilterReferance('date');
    expect(response).toEqual(false);
  }));

  it('should call getFiltersValues', ()=>{
    jest.spyOn(component,'getFiltersValues');
    component.getFiltersValues('state');
    expect(component.getFiltersValues).toHaveBeenCalled();
  })

  it('should call getFiltersValues with array arg', ()=>{
    jest.spyOn(component,'getFiltersValues');
    component.getFiltersValues(['state']);
    expect(component.getFiltersValues).toHaveBeenCalled();
  })

  it('should call filterData with multi filters', fakeAsync(() => {
    jest.spyOn(component, 'filterData');
    component.filters = mockChartData.filters;
    component.previousFilters = {};
    component.chartData = [{ data: mockChartData.chartData, id: 'chartId' }];
    component.currentReference = 'state';
    component.selectedFilters = {"Plays":['10'],"state":['b00bc992ef25f1a9a8d63291e20efc8d'],"Date": '2020-04-28'};
    component.filterData();
    expect(component.filterData).toHaveBeenCalled();
  }));

  it('should call getDateRange', () => {
    jest.spyOn(component, 'getDateRange');
    component.filtersFormGroup = new FormBuilder().group({
          Date: ['1']
    });
    component.getDateRange({startDate:"2022-07-04T18:30:00.000Z", endDate:"2022-07-06T18:30:00.000Z"},'Date');
    expect(component.getDateRange).toHaveBeenCalled();
  })

  it('should call checkDependencyFilters', () => {
    component.filtersFormGroup = new FormBuilder().group({
      Organisation: new FormControl('xyz')
    });
    jest.spyOn(component,'checkDependencyFilters')
    component.filters = mockChartData.dependencyFilters;
    component.selectedFilters = mockChartData.selectedFiltersWithoutDependecy;
    component.checkDependencyFilters();
    expect(component.checkDependencyFilters).toHaveBeenCalled();
    expect(component.selectedFilters).toEqual(mockChartData.resultedFilters);
  })

  it('should call ngOnDestroy', () => {
    component.unsubscribe = {
      next: jest.fn(),
      complete: jest.fn()
  } as any;
    jest.spyOn(component,'ngOnDestroy')
    component.ngOnDestroy();
    expect(component.unsubscribe).toBeDefined()
});
});
