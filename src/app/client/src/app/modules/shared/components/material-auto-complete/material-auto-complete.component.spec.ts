import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MaterialAutoCompleteComponent } from './material-auto-complete.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { configureTestSuite } from '@sunbird/test-util';
import { AutocompletePipe } from './auto-complete-pipe'

describe('MaterialAutoCompleteComponent', () => {
  let component: MaterialAutoCompleteComponent;
  let fixture: ComponentFixture<MaterialAutoCompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports:[],
      declarations: [ MaterialAutoCompleteComponent,AutocompletePipe ]
    })
    .compileComponents();
  }));

  configureTestSuite();

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialAutoCompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call DropdownValueSelected ', fakeAsync(() => {

    component.dropdownList = ["a","b","c"];
    component.ngOnChanges();
    tick(1000);


    component.selected = ["a","b"];
    component.DropdownValueSelected("c");
    expect(component.selected).toEqual(["a","b","c"]);
    tick(1000);

    component.selected = ["a","b"];
    component.DropdownValueSelected("a");
    expect(component.selected).toEqual(["b"]);

  }));
  it('should call dropDownSelectedShow ', fakeAsync(() => {

    component.dropdownList = ["a","b","c"];
    component.ngOnChanges();

    tick(1000);
    component.selected = [];
    component.dropDownSelectedShow();
    expect(component.selectedDpdwnInput).toEqual('0 selections');

    tick(1000);
    component.selected = ["a"];
    component.dropDownSelectedShow();
    expect(component.selectedDpdwnInput).toEqual('1 selections');

  }));
  it('should call DisplayDropdown ', fakeAsync(() => {

    component.dropdownList = ["a","b","c"];
    component.ngOnChanges();

    tick(1000);
    component.DisplayDropdown();
    expect(component.displayDropdown).toEqual(true);

  }));
  it('should call isChecked ', fakeAsync(() => {

    component.dropdownList = ["a","b","c"];
    component.ngOnChanges();

    tick(1000);
    component.selected = ["a"];
    const res=  component.isChecked("a");
    expect(res).toEqual(true);

    tick(1000);
    component.selected = ["a"];
    const res2 = component.isChecked("b");
    expect(res2).toEqual(false);

  }));




});
