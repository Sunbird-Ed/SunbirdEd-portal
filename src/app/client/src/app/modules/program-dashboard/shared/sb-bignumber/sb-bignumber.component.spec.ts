import { ViewContainerRef } from "@angular/core";
import { PdServiceService } from "../services/pd-service/pd-service.service";
import { SbBignumberComponent } from "./sb-bignumber.component";
import { mockBigChart } from "./sb-bignumber.component.spec.data";
describe("SbBignumberComponent", () => {
  let component: SbBignumberComponent;
  let resourceService;
  let dialog;
  let filterService:PdServiceService = {
    getFilteredData:jest.fn().mockReturnValue([mockBigChart.chart.chartData[0]]) as any
  }

  beforeAll(() => {
    component = new SbBignumberComponent(resourceService, dialog,filterService);
    component.chart = mockBigChart;
    component.hideElements = false;
    component.lastUpdatedOn = mockBigChart.chart.lastUpdatedOn;
    component.chart.chartConfig = mockBigChart.chart.chartConfig;
    component.chartData = mockBigChart.chart.chartData;
  });

  beforeEach(() => {
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
    component.appliedFilters =  {
      district_externalId:'2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03',
      organisation_id:'0126796199493140480'
    }   
    jest.spyOn(component, "ngOnChanges");
    component.outletRef = {
      clear(): void {},
      createEmbeddedView(): void {},
    } as unknown as ViewContainerRef;
    component.ngOnChanges({});
    expect(component.ngOnChanges).toHaveBeenCalled();
  });

  it("should call checkForChanges with only globalDistrict", () => {
    component.appliedFilters = {
      district_externalId:'b617e607-0a5b-45a0-9894-7a325ffa45c7'
    }
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
  });

  it("should call checkForChanges with only globalOrg", () => {
    component.appliedFilters = {
      organisation_id:'0126796199493140480'
    }
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
  });

  it("should call checkForChanges with globalDistrict and globalOrg", () => {
    component.appliedFilters =  {
      district_externalId:'2f76dcf5-e43b-4f71-a3f2-c8f19e1fce03',
      organisation_id:'0126796199493140480'
}
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
  });

  it("should call checkForChanges without globalDistrict and globalOrg", () => {
    component.appliedFilters = {}
    component.outletRef = {
      clear(): void {},
      createEmbeddedView(): void {},
    } as unknown as ViewContainerRef;
    jest.spyOn(component, "checkForChanges");
    component.checkForChanges();
    expect(component.checkForChanges).toHaveBeenCalled();
    expect(component.globalData).toBeDefined();
    expect(component.globalChange).toBeFalsy();
  });
});