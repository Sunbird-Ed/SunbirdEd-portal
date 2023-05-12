import { TemplateRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { SbChartComponent } from "./sb-chart.component";
import { mockChart } from "./sb-chart.component.spec.data";

describe("SbChartComponent", () => {
  let component: SbChartComponent;
  let resourceService;
  let dialog;

  beforeAll(() => {
    component = new SbChartComponent(resourceService, dialog);
    component.hideElements = false;
    component.chart = mockChart.chart;
    component.lastUpdatedOn = mockChart.chart.lastUpdatedOn;
    component.chartConfig = mockChart.chart.chartConfig;
    component.chartData = mockChart.chart.chartData;
  });

  beforeEach(() => {
    component.globalOrg = undefined;
    component.globalDistrict = undefined;
    jest.clearAllMocks();
  });

  it("should create chart component", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    jest.spyOn(component, "ngOnInit");
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(component.updatedData).toBeDefined();
    expect(component.chartConfig).toBeDefined();
    expect(component.type).toBeDefined();
  });

  it("should call ngOnChanges", () => {
    jest.spyOn(component, "ngOnChanges");
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    component.ngOnChanges({});
    expect(component.ngOnChanges).toHaveBeenCalled();
  });

  it("should call checkForGlobalChanges with only globalDistrict", () => {
    component.globalDistrict = "b617e607-0a5b-45a0-9894-7a325ffa45c7";
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    jest.spyOn(component, "ngOnChanges");
    jest.spyOn(component, "checkForGlobalChanges");
    component.checkForGlobalChanges();
    expect(component.checkForGlobalChanges).toHaveBeenCalled();
    expect(component.globalData).toBeDefined();
    expect(component.globalOrg).toBeUndefined();
    expect(component.globalChange).toBeTruthy();
    expect(component.updatedData).toBeDefined();
  });

  it("should call checkForGlobalChanges with only globalOrg", () => {
    component.globalOrg = "0126796199493140480";
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    jest.spyOn(component, "ngOnChanges");
    jest.spyOn(component, "checkForGlobalChanges");
    component.checkForGlobalChanges();
    expect(component.checkForGlobalChanges).toHaveBeenCalled();
    expect(component.globalData).toBeDefined();
    expect(component.globalDistrict).toBeUndefined();
    expect(component.globalChange).toBeTruthy();
    expect(component.updatedData).toBeDefined();
  });

  it("should call checkForGlobalChanges with globalDistrict and globalOrg", () => {
    component.globalOrg = "0126796199493140480";
    component.globalDistrict = "b617e607-0a5b-45a0-9894-7a325ffa45c7";
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    jest.spyOn(component, "ngOnChanges");
    jest.spyOn(component, "checkForGlobalChanges");
    component.checkForGlobalChanges();
    expect(component.checkForGlobalChanges).toHaveBeenCalled();
    expect(component.globalData).toBeDefined();
    expect(component.globalChange).toBeTruthy();
    expect(component.updatedData).toBeDefined();
    expect(component.globalDistrict).toBeDefined();
    expect(component.globalOrg).toBeDefined();
  });

  it("should call checkForGlobalChanges without globalDistrict and globalOrg", () => {
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    jest.spyOn(component, "ngOnChanges");
    jest.spyOn(component, "checkForGlobalChanges");
    component.checkForGlobalChanges();
    expect(component.checkForGlobalChanges).toHaveBeenCalled();
    expect(component.globalData).toBeDefined();
    expect(component.globalDistrict).toBeUndefined();
    expect(component.globalOrg).toBeUndefined();
    expect(component.globalChange).toBeFalsy();
  });

  it("should update the view with change in chart type", () => {
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    jest.spyOn(component, "changeChartType");
    component.changeChartType({ value: "line" });
    expect(component.changeChartType).toHaveBeenCalled();
    expect(component.type).toBeDefined();
  });

  it("should reset the filters with global change", () => {
    component.globalChange = true;
    component.globalData = component.chartData;
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    jest.spyOn(component, "resetForm");
    component.resetForm();
    expect(component.resetForm).toHaveBeenCalled();
    expect(component.resetFilters).toBeDefined();
  });

  it("should reset the filters without global change", () => {
    component.globalChange = false;
    component.globalData = component.chartData;
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    jest.spyOn(component, "resetForm");
    component.resetForm();
    expect(component.resetForm).toHaveBeenCalled();
    expect(component.resetFilters).toBeDefined();
  });

  it("should call the openDialog method", () => {
    component.filterPopUpMat = {} as TemplateRef<any>;
    component.dialog = {
      open(): void {},
    } as unknown as MatDialog;
    jest.spyOn(component, "openDialog");
    component.openDialog();
    expect(component.openDialog).toHaveBeenCalled();
  });

  it("should call the closeDialog method", () => {
    component.dialogRef = {
      close(): void {},
    } as unknown as MatDialog;
    jest.spyOn(component, "closeDialog");
    component.closeDialog();
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it("should call the filterModalPopup method with false arg", () => {
    jest.spyOn(component, "filterModalPopup");
    component.filterModalPopup(false);
    expect(component.filterModalPopup).toHaveBeenCalledWith(false);
  });

  it("should call the filterModalPopup method with true arg with global change", () => {
    component.filterPopUpMat = {} as TemplateRef<any>;
    component.dialog = {
      open(): void {},
    } as unknown as MatDialog;
    jest.spyOn(component, "openDialog");
    component.currentFilters = [];
    component.globalChange = true;
    component.globalData = mockChart.filter.chartData;
    jest.spyOn(component, "filterModalPopup");
    component.filterModalPopup(true);
    expect(component.filterModalPopup).toHaveBeenCalledWith(true);
  });

  it("should call the filterModalPopup method with true arg without global change", () => {
    component.filterPopUpMat = {} as TemplateRef<any>;
    component.dialog = {
      open(): void {},
    } as unknown as MatDialog;
    jest.spyOn(component, "openDialog");
    component.currentFilters = [];
    component.globalChange = false;
    component.chartData = mockChart.filter.chartData;
    jest.spyOn(component, "filterModalPopup");
    component.filterModalPopup(true);
    expect(component.filterModalPopup).toHaveBeenCalledWith(true);
  });

  it("should call the filterModalPopup method without global change and currentFilters", () => {
    component.filterPopUpMat = {} as TemplateRef<any>;
    component.dialog = {
      open(): void {},
    } as unknown as MatDialog;
    jest.spyOn(component, "openDialog");
    component.globalChange = false;
    component.currentFilters = undefined;
    component.chartData = mockChart.filter.chartData;
    jest.spyOn(component, "filterModalPopup");
    component.filterModalPopup(true);
    expect(component.filterModalPopup).toHaveBeenCalledWith(true);
  });

  it("should call the filterModalPopup method with global change and without currentFilters", () => {
    component.filterPopUpMat = {} as TemplateRef<any>;
    component.dialog = {
      open(): void {},
    } as unknown as MatDialog;
    jest.spyOn(component, "openDialog");
    component.globalChange = true;
    component.currentFilters = undefined;
    component.globalData = mockChart.filter.chartData;
    jest.spyOn(component, "filterModalPopup");
    component.filterModalPopup(true);
    expect(component.filterModalPopup).toHaveBeenCalledWith(true);
  });

  it("should call filterChanged method", () => {
    jest.spyOn(component, "filterChanged");
    component.globalChange = false;
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    component.filterChanged(mockChart.filter);
    expect(component.filterChanged).toHaveBeenCalled();
  });

  it("should call filterChanged method with global change", () => {
    jest.spyOn(component, "filterChanged");
    component.globalChange = true;
    component.globalData = component.chartData;
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    component.filterChanged(mockChart.filter);
    expect(component.filterChanged).toHaveBeenCalled();
  });

  it("should call filterChanged method without arg", () => {
    jest.spyOn(component, "filterChanged");
    component.globalChange = false;
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    component.filterChanged(mockChart.noFilters);
    expect(component.filterChanged).toHaveBeenCalled();
  });

  it("should call filterChanged method with global change and without arg", () => {
    jest.spyOn(component, "filterChanged");
    component.globalChange = true;
    component.globalData = component.chartData;
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    component.filterChanged(mockChart.noFilters);
    expect(component.filterChanged).toHaveBeenCalled();
  });
});
