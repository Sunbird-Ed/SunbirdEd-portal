import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { ExportToCsv } from 'export-to-csv';
import * as _ from 'lodash-es';
import dayjs from 'dayjs';
import { ResourceService } from '../../services/resource/resource.service';
import { Observable, Subject } from 'rxjs';
import { TelemetryService } from '@sunbird/telemetry';
import { SbDatatableComponent, multiFilter } from './sb-datatable.component';
import { TableData } from './sb-datatable.component.spec.data';

describe('SbDatatableComponent', () => {
  let component: SbDatatableComponent;
  const mockResourceService: Partial<ResourceService> = {};
  const mockTelemetryService: Partial<TelemetryService> = {
    interact: jest.fn()
  };
  beforeAll(() => {
    component = new SbDatatableComponent(
      mockResourceService as ResourceService,
      mockTelemetryService as TelemetryService
    )
  });
  beforeEach(() => {
    jest.clearAllMocks();
    component.keyUp = new Subject() as any;
    //component.keyUp.next({ key: 'A', keyCode: 65 })
  });

  it('should be create a instance of SbDatatableComponent', () => {
    expect(component).toBeTruthy();
  });
  it('should be create a instance of SbDatatableComponent and call onColumnFilter method with key but no value', () => {
    const key = 'state';
    const value = null;
    component.data = TableData.responseData;
    component.listFilter = TableData.searchFields;
    jest.spyOn(component, 'filterDataTable');
    component.onColumnFilter(key, value);
    expect(component.filterDataTable).toBeCalled();
  });
  it('should be create a instance of SbDatatableComponent and call onColumnFilter method with key and value', () => {
    const key = 'state';
    const value = 'abcd';
    component.data = TableData.responseData;
    component.listFilter = TableData.sortData_DESC;
    jest.spyOn(component, 'filterDataTable');
    component.onColumnFilter(key, value);
    expect(component.filterDataTable).toBeCalled();
  });
  describe('ngOnInit', () => {
    it('should initialize the component and call the ngOnInit method ', () => {
      const keyUpSubject = new Subject<object>();
      component.keyUp = keyUpSubject;
      component.ngOnInit();
      //expect(component.keyUp.subscribe).toHaveBeenCalled();  
    });
  })
  it("should call ngOnChanges method", () => {
    component.message = 'table data will be displayed here';
    component.columns = ['A', 'B', 'C'];
    component.ngOnChanges();
    const obj = {
      emptyMessage: component.message
    }
    expect(component.tableMessage).toEqual(obj);
  });
  it("should call downloadUrl method", () => {
    window.open = jest.fn();
    const prop = 'downloadUrls';
    const row = {
      expiresAt: '1234567890',
      downloadUrls: [
        'www.sunbirded.com', 'www.sunbird.com'
      ]
    };
    component.downloadUrl(prop, row);
    expect(window.open).toHaveBeenCalledWith('www.sunbirded.com', '_blank');
  });
  it("should call downloadUrl method with downloadLink emit called", () => {
    jest.spyOn(component.downloadLink, 'emit');
    const prop = 'downloadUrls';
    const row = {
      expiresAt: '2009-05-23',
      downloadUrls: [
        'www.sunbirded.com', 'www.sunbird.com'
      ]
    };
    component.downloadUrl(prop, row);
    expect(component.downloadLink.emit).toHaveBeenCalled();
  });
  it('should be create a instance and call the method clearSearch', () => {
    component.searchData = 'I am trying to search';
    component.clearSearch()
    expect(component.searchData).toEqual('');
  });
  it('should set Interact Event Data', () => {
    jest.spyOn(mockTelemetryService, 'interact');
    component.setInteractEventData();
    expect(component.telemetryService.interact).toBeCalled();
  });
  it('should call the method downloadCSVFile', () => {
    jest.spyOn(component,'setInteractEventData');
    component.name = 'fileName';
    component.columns = [{name:'A'},{name:'B'},{name:'C'}];
    const mockGenerateCsv = jest.fn();
      jest.spyOn(ExportToCsv.prototype, 'generateCsv').mockImplementation(mockGenerateCsv);
    component.downloadCSVFile();
    expect(component.setInteractEventData).toBeCalled();
  });
});
