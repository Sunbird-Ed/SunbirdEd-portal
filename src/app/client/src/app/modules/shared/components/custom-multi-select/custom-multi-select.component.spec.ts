import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomMultiSelectComponent } from './custom-multi-select.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {Response} from './custom-multi-select.component.spec.data';
describe('CustomMultiSelectComponent', () => {
  let component: CustomMultiSelectComponent;
  let fixture: ComponentFixture<CustomMultiSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, SuiModule],
      declarations: [ CustomMultiSelectComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMultiSelectComponent);
    component = fixture.componentInstance;
  });
  it('should call checkbox when checkbox value is false ', () => {
    const name = 'NCERT';
    component.checkBox = {};
    component.checkbox(name);
    expect(component.checkBox[name]).toBeTruthy();
  });
  it('should call checkbox when checkbox value is true ', () => {
    const name = 'NCERT';
    component.checkBox = {};
    component.checkBox[name] = true;
    component.checkbox(name);
    expect(component.checkBox[name]).toBeFalsy();
    expect(component.selectAllCheckBox).toBeFalsy();
  });
  it('should call selectAll when selectAllCheckBox value is true ', () => {
    const code = 'board';
    component.checkBox = {};
    component.field = Response.field;
    component.selectAllCheckBox = false;
    component.selectAll(code);
    expect(component.selectAllCheckBox).toBeTruthy();
    expect(component.checkBox).toEqual(Response.selectAll);
    expect(component.inputData).toEqual(Response.inputData);
  });
  it('should call selectAll when selectAllCheckBox value is false ', () => {
    const code = 'board';
    component.checkBox = {};
    component.field = Response.field;
    component.selectAllCheckBox = true;
    component.selectAll(code);
    expect(component.selectAllCheckBox).toBeFalsy();
    expect(component.checkBox).toEqual(Response.selectAllFalse);
    expect(component.inputData).toEqual([]);
  });
  it('should call ngOninit when all values are selected', () => {
    component.checkBox = {};
    component.inputData = Response.inputData;
    component.field = Response.field;
    fixture.detectChanges();
    expect(component.selectAllCheckBox).toBeTruthy();
    expect(component.checkBox).toEqual(Response.selectAll);
  });
  it('should call ngOninit when all values are not selected', () => {
    component.checkBox = {};
    component.inputData = Response.inputData2;
    component.field = Response.field;
    fixture.detectChanges();
    expect(component.selectAllCheckBox).toBeFalsy();
    expect(component.checkBox).toEqual(Response.selected);
  });
  it('should call selectedOption when all are selected', () => {
    component.field = Response.field;
   component.selectedOption(Response.inputData);
    expect(component.selectAllCheckBox).toBeTruthy();
  });
});
