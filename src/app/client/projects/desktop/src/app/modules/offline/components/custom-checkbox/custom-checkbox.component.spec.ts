import { resourceBundle, fieldData, inputData } from './custom-checkbox.component.spec.data';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCheckboxComponent } from './custom-checkbox.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CustomCheckboxComponent', () => {
  let component: CustomCheckboxComponent;
  let fixture: ComponentFixture<CustomCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomCheckboxComponent ],
      imports: [SharedModule.forRoot(), HttpClientTestingModule],
      providers: [{provide: ResourceService, useValue: resourceBundle}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call modifydata', () => {
    spyOn(component, 'modifyData');
    component.ngOnInit();
    expect(component.modifyData).toHaveBeenCalled();
  });

  it('should modifyData', () => {
    component.field = fieldData;
    component.inputData = inputData;
    component.modifyData();
    expect(component.checkBox['Class 7']).toBeTruthy();
  });

  it('should make selectall checkbox false', () => {
    component.field = fieldData;
    component.inputData = inputData;
    component.selectAllCheckBox = true;
    component.selectAll();
    expect(component.selectAllCheckBox).toBeFalsy();
    expect(component.checkBox[fieldData[0].associations[0].name]).toBeFalsy();
  });

  it('should make selectall checkbox true', () => {
    component.field = fieldData;
    component.inputData = inputData;
    component.selectAllCheckBox = false;
    component.selectAll();
    expect(component.selectAllCheckBox).toBeTruthy();
    expect(component.checkBox[fieldData[0].name]).toBeTruthy();
  });
});
