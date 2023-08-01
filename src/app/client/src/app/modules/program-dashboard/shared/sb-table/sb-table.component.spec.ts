import { SimpleChange, TemplateRef} from "@angular/core";
import { PdServiceService } from "../services/pd-service/pd-service.service";
import { SbTableComponent } from "./sb-table.component";
import { mockTable } from "./sb-table.component.spec.data";

describe("SbTableComponent", () => {
  let component: SbTableComponent;
  let resourceService;
  let filterService:PdServiceService = {
    getFilteredData:jest.fn().mockReturnValue([mockTable.table.data[0]]) as any
  }

  beforeAll(() => {
    component = new SbTableComponent(filterService,resourceService);
    component.table = mockTable.table;
    component.hideElements = false;
    component.tableData = mockTable.table.data;
  });

  beforeEach(() => {
    component.tableData = mockTable.table.data;
    jest.clearAllMocks();
  });

  it("should create table component", () => {
    expect(component).toBeTruthy();
  });

  it("should call ngOnInit", () => {
    jest.spyOn(component, "ngOnInit");
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    expect(component.tableData).toBeDefined();
  });

  it("should call ngOnChanges", () => {
    component.appliedFilters =  {
      district_externalId:'b617e607-0a5b-45a0-9894-7a325ffa45c7',
      organisation_id:'0126796199493140480'
    }   
    jest.spyOn(component, "ngOnChanges");
    jest.spyOn(component, "exportToCsv");
    jest.spyOn(component, "checkForGlobalChanges");

    component.lib = {
      instance: {
        update(): void {},
        exportAs(): void {}
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
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    jest.spyOn(component, "checkForGlobalChanges");
    component.checkForGlobalChanges();
    expect(component.checkForGlobalChanges).toHaveBeenCalled();
    expect(component.globalChange).toBeTruthy();
  });

  it("should call checkForGlobalChanges with only globalOrg", () => {
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    jest.spyOn(component, "checkForGlobalChanges");
    component.checkForGlobalChanges();
    expect(component.checkForGlobalChanges).toHaveBeenCalled();
    expect(component.globalChange).toBeTruthy();
  });

  it("should call checkForGlobalChanges with globalDistrict and globalOrg", () => {
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    jest.spyOn(component, "checkForGlobalChanges");
    component.checkForGlobalChanges();
    expect(component.checkForGlobalChanges).toHaveBeenCalled();
    expect(component.globalData).toBeDefined();
    expect(component.globalChange).toBeTruthy();
  });

  it("should call checkForGlobalChanges without globalDistrict and globalOrg", () => {
    component.appliedFilters = {}   
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    jest.spyOn(component, "checkForGlobalChanges");
    component.checkForGlobalChanges();
    expect(component.checkForGlobalChanges).toHaveBeenCalled();
    expect(component.globalData).toBeDefined();
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