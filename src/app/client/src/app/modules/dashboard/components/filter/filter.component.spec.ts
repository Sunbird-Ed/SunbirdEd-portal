
import { FilterComponent } from './filter.component';
import { mockChartData } from './filter.component.spec.data';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { ResourceService } from '../../../shared';
import { fakeAsync, tick } from '@angular/core/testing';
import { MatAutocomplete } from '@angular/material/autocomplete';

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
        reportSummary: 'Report Summary',
        selectDependentFilter: 'Select {displayName} filter'
      }
    },
    languageSelected$: of({})
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({})
  };
  const mockFormBuilder: Partial<FormBuilder> = {
    group: jest.fn(() => new FormGroup({})),
    control: jest.fn(() => new FormControl('')),
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

  it('should choose the first option', () => {
    const mockMatAutocomplete: any = {
      options: { first: { select: jest.fn() } }
    };
    component.matAutocomplete = mockMatAutocomplete;
    component.chooseOption();
    expect(mockMatAutocomplete.options.first.select).toHaveBeenCalled();
  });

  it('should set error message with displayName', () => {
    const event = { displayName: 'ExampleFilter' };
    component.showErrorMessage(event);
    expect(component.errorMessage).toBe('Select ExampleFilter filter');
  });

  it('should not set error message without displayName', () => {
    const event = { displayName: undefined };
    component.showErrorMessage(event);
    expect(component.errorMessage).toBeUndefined();
  });

  it('should set selected filters and generate form when selectedFilter is set', fakeAsync(() => {
    const mockSelectedFilter = {
      filters: [
        { controlType: 'text', reference: 'Organisation' },
      ],
      data: [],
      selectedFilters: {
        Organisation: 'Organisation 1',
      },
    };
    jest.spyOn(component, 'formGeneration').mockImplementation(() => {});
    component.selectedFilter = mockSelectedFilter;
    jest.advanceTimersByTime(0);
    expect(component.formGeneration).toHaveBeenCalledWith(mockSelectedFilter.data);
    expect(component.selectedFilters).toEqual(mockSelectedFilter.selectedFilters);
    expect(component.filtersFormGroup.value).toEqual(mockSelectedFilter.selectedFilters);
  }));

  it('should set filters from val.filters when reset is not true and val.filters is provided', () => {
    const mockFilters = {
      Organisation: 'Organisation 1',
    };
    component.filtersFormGroup.setValue({
      Organisation: 'Organisation 1',
    });
    component.resetFilters = {
      data: mockChartData,
      filters: mockFilters,
      reset: false,
    };
    expect(component.filtersFormGroup.value).toEqual(mockFilters);
    expect(component.selectedFilters).toEqual(mockFilters);
  });


});
