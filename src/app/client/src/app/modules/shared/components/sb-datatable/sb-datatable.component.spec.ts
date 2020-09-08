import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SbDatatableComponent } from './sb-datatable.component';
import { TableData } from './sb-datatable.component.spec.data';
import { ExportToCsv } from 'export-to-csv';
import * as _ from 'lodash-es';
import { FilterPipe } from '../../pipes/filter/filter.pipe';

describe('SbDatatableComponent', () => {
  let component: SbDatatableComponent;
  let fixture: ComponentFixture<SbDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SbDatatableComponent, FilterPipe],
      imports: [FormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SbDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onchanges', () => {
    component.data = TableData.responseData;
    component.ngOnChanges();
    expect(JSON.stringify(component.tableData)).toBe(JSON.stringify(component.data))
  });

  // it('should call search with search fields', () => {
  //   component.searchFields = TableData.searchFields;
  //   spyOn(component, 'filterData').and.stub();
  //   component.data = TableData.responseData;
  //   component.searchData = 'Nellore';
  //   component.search()
  //   expect(component.filterData).toHaveBeenCalled();
  // });

  // it('should call search with search fields else case', () => {
  //   component.searchFields = TableData.searchFields;
  //   component.data = TableData.responseData;
  //   component.searchData = '';
  //   component.search()
  //   expect(component.tableData).toBe(component.data);
  // })

  // it('should call search without search fields', () => {
  //   component.searchFields =[];
  //   component.data = TableData.responseData;
  //   component.searchData = 70;
  //   component.search()
  //   expect(component.tableData).toEqual([{
  //     state: 'Andhra Pradesh',
  //     district: 'Guntur',
  //     noofEnrollments: 70,
  //     noofCompletions: 30
  //   }]);
  // })

  // it('should call filterData', () => {
  //   const data = TableData.responseData;
  //   component.searchFields = TableData.searchFields;
  //   component.searchData = 'Nellore';
  //   expect(component.filterData(data)).toEqual([{
  //     state: 'Andhra Pradesh',
  //     district: 'Nellore',
  //     noofEnrollments: 100,
  //     noofCompletions: 25
  //   }]);
  // });

  it('should call sort ASC', () => {
    component.tableData = TableData.responseData;
    component.sortOrder = 'desc';
    component.sort({ name: 'District', isSortable: true, prop: 'district' });
    expect(component.sortField).toBe('district');
    expect(component.tableData).toEqual(TableData.sortData_ASC)
  });

  it('should call sort DESC', () => {
    component.tableData = TableData.responseData;
    component.sortOrder = 'asc';
    component.sort({ name: 'District', isSortable: true, prop: 'district' });
    expect(component.sortField).toBe('district');
    expect(component.tableData).toEqual(TableData.sortData_DESC)
  });

  it('should call clearSearch', () => {
    component.clearSearch()
    expect(component.searchData).toBe('');
  });

  it('should call downloadCSVFile', () => {
    component.columns = TableData.columns;
    component.tableData = TableData.responseData;
    component.downloadCSVFile();
    expect(component.csvExporter instanceof ExportToCsv).toBeTruthy();
  });

});
