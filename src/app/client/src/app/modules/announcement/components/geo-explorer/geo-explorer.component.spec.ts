
import {throwError as observableThrowError, of as observableOf,  Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule, ToasterService } from '@sunbird/shared';

// NG core testing module
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
// SB scomponent(s) and service(s)
import { GeoExplorerComponent } from './geo-explorer.component';
import { LearnerService, UserService, CoreModule } from '@sunbird/core';
import { GeoExplorerService } from './../../services/geo-explorer/geo-explorer.service';


// Test data
import * as mockData from './geo-explorer.component.spec.data';
import { Ng2IziToastModule } from 'ng2-izitoast';
const testData = <any>mockData.mockRes;

describe('GeoExplorerComponent', () => {
  let component: GeoExplorerComponent;
  let fixture: ComponentFixture<GeoExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeoExplorerComponent ],
      providers: [ToasterService , GeoExplorerService, LearnerService, UserService],
      imports: [HttpClientTestingModule, SuiModule, FormsModule, SharedModule.forRoot(), Ng2IziToastModule, CoreModule.forRoot()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize Service Adopter', inject([GeoExplorerService], (geoExplorerService) => {
    expect(component).toBeTruthy();
    component.geoConfig = {geo: { adaptor: 'SERVICE', service: 'geoService' }};
    spyOn(component, 'validateAdaptor').and.callThrough();
    spyOn(component, 'initializeServiceAdopter').and.callThrough();
    component.validateAdaptor();
    fixture.detectChanges();
    expect(component.validateAdaptor).toHaveBeenCalled();
    expect(component.initializeServiceAdopter).toHaveBeenCalled();
  }));

  it('should return location list', inject([GeoExplorerService, LearnerService], (geoService, learnerService) => {
    component.rootOrgId = 'ORG_001';
    component.locationList = [];
    spyOn(geoService, 'getLocations').and.callFake(() => observableOf(testData.locationSuccessData));
    component.initializeServiceAdopter();
    fixture.detectChanges();
    expect(component.locationList).not.toBeUndefined();
    expect(component.locationList.length).not.toBe(0);
    expect(component.showLoader).toEqual(false);
  }));

  it('should return location list', inject([GeoExplorerService, LearnerService], (geoService, learnerService) => {
    component.rootOrgId = 'ORG_001';
    component.locationList = [];
    spyOn(geoService, 'getLocations').and.callFake(() => observableThrowError({}));
    component.initializeServiceAdopter();
    fixture.detectChanges();
    expect(component.locationList).not.toBeUndefined();
    expect(component.locationList.length).toBe(0);
    expect(component.showError).toEqual(true);
  }));

  it('should update selected item list', () => {
    expect(component).toBeTruthy();
    const newItem = testData.locationSuccessData.result.response[0];
    component.selectedItems = [];
    spyOn(component, 'toggle').and.callThrough();
    component.toggle(true, newItem, newItem.id);
    fixture.detectChanges();
    expect(component.toggle).toHaveBeenCalled();
    expect(component.selectedItems.length).toBe(1);
  });

  it('should remove / uncheck selected location', () => {
    component.selectedItems = [];
    const newItem = testData.locationSuccessData.result.response[0];
    component.selectedItems.push(testData.locationSuccessData.result.response[0]);
    spyOn(component, 'toggle').and.callThrough();
    component.toggle(false, newItem, newItem.id);
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.toggle).toHaveBeenCalled();
    expect(component.selectedItems.length).toEqual(0);
  });

  it('should populate selected items', () => {
    const data = testData.locationSuccessData.result.response[0];
    component.selectedItems = [];
    component.locationList = testData.locationSuccessData.result.response;
    spyOn(component, 'populateItems').and.callThrough();
    component.populateItems();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.populateItems).toHaveBeenCalledWith();
   // expect(component.selectedItems[0].selected).toEqual(true);
  });

  it('should throw error - adaptor config not found', () => {
    component.geoConfig = {};
    spyOn(component, 'validateAdaptor').and.callThrough();
    component.validateAdaptor();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.showError).toEqual(true);
  });

  it('should throw error - invalid adaptor config', () => {
    component.geoConfig = {geo: { adaptor: 'TEST', service: 'geoService' }};
    spyOn(component, 'validateAdaptor').and.callThrough();
    component.validateAdaptor();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.showError).toEqual(true);
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.initializeServiceAdopter();
    component.ngOnInit();
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });
});
