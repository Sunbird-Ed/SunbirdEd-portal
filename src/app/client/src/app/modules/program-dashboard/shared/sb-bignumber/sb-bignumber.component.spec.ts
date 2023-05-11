import { ViewContainerRef } from "@angular/core";
import { SbBignumberComponent } from "./sb-bignumber.component";
import { mockBigChart } from "./sb-bignumber.component.spec.data";
xdescribe("SbBignumberComponent", () => {
  let component: SbBignumberComponent;
  let resourceService;
  let dialog;

  beforeAll(() => {
    component = new SbBignumberComponent(resourceService, dialog);
    component.chart = mockBigChart;
    component.hideElements = false;
    component.lastUpdatedOn = mockBigChart.chart.lastUpdatedOn;
    component.chart.chartConfig = mockBigChart.chart.chartConfig;
    component.chartData = mockBigChart.chart.chartData;
  });

  beforeEach(() => {
    component.globalOrg = undefined;
    component.globalDistrict = undefined;
    jest.clearAllMocks();
  });

  it("should create bignumber component", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    jest.spyOn(component, "ngOnInit");
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(component.updatedData).toBeDefined();
    expect(component.chartConfig).toBeDefined();
  });

  it("should call ngOnChanges", () => {
    component.globalOrg = "0126796199493140480";
    component.globalDistrict = "b617e607-0a5b-45a0-9894-7a325ffa45c7";
    jest.spyOn(component, "ngOnChanges");
    component.outletRef = {
      clear(): void {},
      createEmbeddedView(): void {},
    } as unknown as ViewContainerRef;
    component.ngOnChanges({});
    expect(component.ngOnChanges).toHaveBeenCalled();
  });

  it("should call checkForChanges with only globalDistrict", () => {
    component.globalDistrict = "b617e607-0a5b-45a0-9894-7a325ffa45c7";
    component.outletRef = {
      clear(): void {},
      createEmbeddedView(): void {},
    } as unknown as ViewContainerRef;
    jest.spyOn(component, "checkForChanges");
    component.checkForChanges();
    expect(component.checkForChanges).toHaveBeenCalled();
    expect(component.globalData).toBeDefined();
    expect(component.globalOrg).toBeUndefined();
    expect(component.globalChange).toBeTruthy();
    expect(component.updatedData).toBeDefined();
  });

  it("should call checkForChanges with only globalOrg", () => {
    component.globalOrg = "0126796199493140480";
    component.outletRef = {
      clear(): void {},
      createEmbeddedView(): void {},
    } as unknown as ViewContainerRef;
    jest.spyOn(component, "checkForChanges");
    component.checkForChanges();
    expect(component.checkForChanges).toHaveBeenCalled();
    expect(component.globalData).toBeDefined();
    expect(component.globalDistrict).toBeUndefined();
    expect(component.globalChange).toBeTruthy();
    expect(component.updatedData).toBeDefined();
  });

  it("should call checkForChanges with globalDistrict and globalOrg", () => {
    component.globalOrg = "0126796199493140480";
    component.globalDistrict = "b617e607-0a5b-45a0-9894-7a325ffa45c7";
    component.outletRef = {
      clear(): void {},
      createEmbeddedView(): void {},
    } as unknown as ViewContainerRef;
    jest.spyOn(component, "checkForChanges");
    component.checkForChanges();
    expect(component.checkForChanges).toHaveBeenCalled();
    expect(component.globalData).toBeDefined();
    expect(component.globalChange).toBeTruthy();
    expect(component.updatedData).toBeDefined();
    expect(component.globalDistrict).toBeDefined();
    expect(component.globalOrg).toBeDefined();
  });

  it("should call checkForChanges without globalDistrict and globalOrg", () => {
    component.outletRef = {
      clear(): void {},
      createEmbeddedView(): void {},
    } as unknown as ViewContainerRef;
    jest.spyOn(component, "checkForChanges");
    component.checkForChanges();
    expect(component.checkForChanges).toHaveBeenCalled();
    expect(component.globalData).toBeDefined();
    expect(component.globalDistrict).toBeUndefined();
    expect(component.globalOrg).toBeUndefined();
    expect(component.globalChange).toBeFalsy();
  });
});
