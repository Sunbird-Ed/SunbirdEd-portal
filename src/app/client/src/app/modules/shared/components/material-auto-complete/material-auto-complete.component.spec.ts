import { ChangeDetectorRef, ElementRef } from "@angular/core";
import { MaterialAutoCompleteComponent } from "./material-auto-complete.component";
import { ToasterService } from "@sunbird/shared";
import { fakeAsync, tick } from "@angular/core/testing";

describe("MaterialAutoCompleteComponent", () => {
  let component: MaterialAutoCompleteComponent;
  let _elementRef:ElementRef;
  const changeDetectorRef:ChangeDetectorRef= {
    detectChanges: jest.fn() as any,
    markForCheck:jest.fn() as any,
    detach:jest.fn() as any,
    checkNoChanges:jest.fn() as any,
    reattach:jest.fn() as any
  }
  let toasterService:ToasterService

  beforeAll(() => {
    component = new MaterialAutoCompleteComponent(_elementRef,changeDetectorRef,toasterService);
    component.searchField = {
        nativeElement : {
        focus:jest.fn() as any
    }
}
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create material auto complete component", () => {
    expect(component).toBeTruthy();
  });

  it('should call DisplayDropdown ', fakeAsync(() => {
    component.dynamicplaceholder = 'Program'
    component.dropdownList = ['a', 'b', 'c'];
    component.ngOnChanges();
    component.DisplayDropdown();
    tick(1000);
    expect(component.displayDropdown).toEqual(true);
  }));

  it('should call DisplayDropdown with dependency ', fakeAsync(() => {
    component.dynamicplaceholder = 'Program'
    component.dropdownList = ['a', 'b', 'c'];
    component.dependency = {
      "reference": "xyz",
      "displayName": "Xyz"
    };
    component.checkFilters = {"xyz":"kbc"}
    component.ngOnChanges();
    component.DisplayDropdown();
    tick(1000);
    expect(component.displayDropdown).toEqual(true);
  }));

  it('should call DisplayDropdown without dependency ', fakeAsync(() => {
    component.dynamicplaceholder = 'Program'
    component.dropdownList = ['a', 'b', 'c'];
    component.dependency = undefined;
    component.ngOnChanges();
    component.DisplayDropdown();
    tick(1000);
    expect(component.displayDropdown).toEqual(true);
  }));
})