import { SimpleChange, TemplateRef, ViewContainerRef } from "@angular/core";
import { SbTableComponent } from "./sb-table.component";
import { mockTable } from "./sb-table.component.spec.data";

describe("SbTableComponent", () => {
  let component: SbTableComponent;
  beforeAll(() => {
    component = new SbTableComponent();
    component.table = mockTable.table;
    component.hideElements = false;
    component.tableData = mockTable.table.data;
  });

  beforeEach(() => {
    component.globalOrg = undefined;
    component.globalDistrict = undefined;
    component.tableData = mockTable.table.data;
    jest.clearAllMocks();
  });

  it("should create bignumber component", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    jest.spyOn(component, "ngOnInit");
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(component.tableData).toBeDefined();
  });

  it("should call ngOnChanges", () => {
    component.globalDistrict = "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03";
    jest.spyOn(component, "ngOnChanges");
    jest.spyOn(component, "exportToCsv");
    jest.spyOn(component, "checkForGlobalChanges");

    component.outletRef = {
      clear(): void {},
      createEmbeddedView(): void {},
    } as unknown as ViewContainerRef;

    component.lib = {
      instance: {
        exportAs(): void {},
      },
    } as unknown as TemplateRef<any>;
    component.ngOnChanges({
      tableToCsv: new SimpleChange(undefined, true, false),
    });
    component.exportToCsv();
    component.checkForGlobalChanges();
    expect(component.ngOnChanges).toHaveBeenCalled();
    expect(component.exportToCsv).toHaveBeenCalled();
  });

  it("should call checkForGlobalChanges with only globalDistrict", () => {
    component.globalDistrict = "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03";
    component.outletRef = {
      clear(): void {},
      createEmbeddedView(): void {},
    } as unknown as ViewContainerRef;
    jest.spyOn(component, "ngOnChanges");
    jest.spyOn(component, "checkForGlobalChanges");
    component.checkForGlobalChanges();
    expect(component.checkForGlobalChanges).toHaveBeenCalled();
    expect(component.globalData).toBeDefined();
    expect(component.globalOrg).toBeUndefined();
    expect(component.globalChange).toBeTruthy();
  });

  it("should call checkForGlobalChanges with only globalOrg", () => {
    component.globalOrg = "0126796199493140480";
    component.outletRef = {
      clear(): void {},
      createEmbeddedView(): void {},
    } as unknown as ViewContainerRef;
    jest.spyOn(component, "ngOnChanges");
    jest.spyOn(component, "checkForGlobalChanges");
    component.checkForGlobalChanges();
    expect(component.checkForGlobalChanges).toHaveBeenCalled();
    expect(component.globalData).toBeDefined();
    expect(component.globalDistrict).toBeUndefined();
    expect(component.globalChange).toBeTruthy();
  });

  it("should call checkForGlobalChanges with globalDistrict and globalOrg", () => {
    component.globalOrg = "0126796199493140480";
    component.globalDistrict = "2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03";
    component.outletRef = {
      clear(): void {},
      createEmbeddedView(): void {},
    } as unknown as ViewContainerRef;
    jest.spyOn(component, "ngOnChanges");
    jest.spyOn(component, "checkForGlobalChanges");
    component.checkForGlobalChanges();
    expect(component.checkForGlobalChanges).toHaveBeenCalled();
    expect(component.globalData).toBeDefined();
    expect(component.globalChange).toBeTruthy();
    expect(component.globalDistrict).toBeDefined();
    expect(component.globalOrg).toBeDefined();
  });

  it("should call checkForGlobalChanges without globalDistrict and globalOrg", () => {
    component.outletRef = {
      clear(): void {},
      createEmbeddedView(): void {},
    } as unknown as ViewContainerRef;
    jest.spyOn(component, "ngOnChanges");
    jest.spyOn(component, "checkForGlobalChanges");
    component.checkForGlobalChanges();
    expect(component.checkForGlobalChanges).toHaveBeenCalled();
    expect(component.globalData).toBeDefined();
    expect(component.globalDistrict).toBeUndefined();
    expect(component.globalOrg).toBeUndefined();
    expect(component.globalChange).toBeFalsy();
  });

  it("should call exportToCsv method", () => {
    jest.spyOn(component, "exportToCsv");
    component.lib = {
      instance: {
        exportAs(): void {},
      },
    } as unknown as TemplateRef<any>;
    component.exportToCsv();
    expect(component.exportToCsv).toHaveBeenCalled();
  });
});
