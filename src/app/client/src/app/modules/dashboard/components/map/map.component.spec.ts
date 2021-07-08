import { TelemetryModule } from '@sunbird/telemetry';
import { DashboardModule } from './../../dashboard.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ToasterService } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { ReportService } from '../../services';
import { configureTestSuite } from '@sunbird/test-util';
import { of, throwError } from 'rxjs';
import { geoJSONDataMock } from './map.component.spec.data';
import { RouterTestingModule } from '@angular/router/testing';
describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  configureTestSuite();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule, DashboardModule, RouterTestingModule, TelemetryModule.forRoot()],
      providers: [ReportService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should find config from the mapping', () => {
    const recordByNameAndType = component['findRecordInConfigMapping']({ type: 'country', name: 'india' });
    expect(recordByNameAndType).toEqual({
      name: 'India',
      code: '',
      type: 'country',
      geoJSONFilename: 'india.json'
    });

    const recordByCode = component['findRecordInConfigMapping']({ code: 3329 });
    expect(recordByCode).toEqual({
      name: 'Chennai',
      code: 3329,
      type: 'district',
      geoJSONFilename: ''
    });
  });

  it('should get geoJSON file', done => {
    const reportService = TestBed.get(ReportService);
    spyOn(reportService, 'fetchDataSource').and.returnValue(of({ result: {} }));
    component['getGeoJSONFile']({ fileName: 'sampleFile.json' })
      .subscribe(res => {
        expect(reportService.fetchDataSource).toHaveBeenCalledWith(`/reports/fetch/geoJSONFiles/sampleFile.json`);
        expect(res).toEqual({});
        done();
      });
  });

  it('should use data if passed in config', done => {
    component.mapData = {
      reportData: {
        data: [123]
      }
    };
    const reportService = TestBed.get(ReportService);
    spyOn(reportService, 'fetchDataSource').and.returnValue(of({ result: {} }));
    component['getDataSourceData']()
      .subscribe(res => {
        expect(res).toBeDefined();
        expect(reportService.fetchDataSource).not.toHaveBeenCalledWith(`/reports/fetch/geoJSONFiles/sampleFile.json`);
        expect(res).toEqual(component['__mapData']['reportData']);
        done();
      });
  });

  it('should download reportData if reportData is not present and reportLoc is present in the configuration', done => {
    component.mapData = { reportLoc: '/reports/fetch/sunbird/sample.json' };
    const reportService = TestBed.get(ReportService);
    spyOn(reportService, 'fetchDataSource').and.returnValue(of({ result: { data: {} } }));
    component['getDataSourceData']()
      .subscribe(res => {
        expect(res).toEqual({});
        expect(reportService.fetchDataSource).toHaveBeenCalledWith(component['__mapData']['reportLoc']);
        done();
      });
  });

  it('subscribe to data hander', done => {
    const getGeoJSONFileSpy = spyOn<any>(component, 'getGeoJSONFile').and.returnValue(of(geoJSONDataMock));
    const getDataSourceDataSpy = spyOn<any>(component, 'getDataSourceData').and.returnValue(of([{ District: 'Daman', plays: 22 }]));
    const findRecordInConfigMappingSpy = spyOn<any>(component, 'findRecordInConfigMapping').and.callThrough();
    const addPropertiesSpy = spyOn<any>(component, 'addProperties').and.callThrough();
    const input = {
      state: 'Daman & Diu',
      districts: ['Daman'],
      labelExpr: 'District',
      metrics: ['plays'],
    };
    component.mapData = input;
    component['dataHandler']().subscribe(res => {
      expect(findRecordInConfigMappingSpy).toHaveBeenCalledWith({ type: 'state', name: input.state });
      expect(getGeoJSONFileSpy).toHaveBeenCalledWith({ fileName: 'damandiu_district.json', folder: 'geoJSONFiles' });
      expect(getDataSourceDataSpy).toHaveBeenCalled();
      expect(addPropertiesSpy).toHaveBeenCalled();
      done();
    });
  });

  it('should handle error if unknow state or country is passed', done => {
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error');
    const findRecordInConfigMappingSpy = spyOn<any>(component, 'findRecordInConfigMapping').and.callThrough();
    const input = {
      state: 'random Country',
      districts: ['Daman'],
      labelExpr: 'District',
      metrics: ['plays'],
    };
    component.mapData = input;
    component['dataHandler']().subscribe(res => {
      expect(toasterService.error).toHaveBeenCalledWith('Failed to render Map');
      expect(findRecordInConfigMappingSpy).toHaveBeenCalledWith({ type: 'state', name: input.state });
      done();
    });
  });

  it('click handler on a feature should emit event', () => {
    const spy = spyOn<any>(component.featureClicked, 'emit');
    component['clickHandler']({ properties: { testKey: 2 }, metaData: { st_nm: 'gujrat' } }, {});
    expect(spy).toHaveBeenCalled();
  });

});
