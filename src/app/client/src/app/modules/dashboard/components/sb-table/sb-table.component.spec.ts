import {ChangeDetectorRef, TemplateRef} from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { SbTableComponent } from './sb-table.component';
import{ mockData} from './sb-table.component.spec.data';
describe("SbTableComponent", () => {
  let component: SbTableComponent;
  const changeDetectorRef:ChangeDetectorRef= {
    detectChanges: jest.fn() as any,
    markForCheck:jest.fn() as any,
    detach:jest.fn() as any,
    checkNoChanges:jest.fn() as any,
    reattach:jest.fn() as any
  }
  let resourceService:ResourceService

  beforeAll(() => {
    component = new SbTableComponent(changeDetectorRef,resourceService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create table component", () => {
    expect(component).toBeTruthy();
  });

  it("should call filterChanged method", () => {
    jest.spyOn(component, "filterChanged");
    component.rowsData =  {
        selectedFilters: {}
    } as any
    component.data = {
        chartData : [
            {
                data:{
                    selectedFilters:{xyz:'xyz'}
                }
            }
        ]
    }
    component.lib = {
      instance: {
        update(): void {},
      },
    } as unknown as TemplateRef<any>;
    component.filterChanged(mockData.filter);
    expect(component.filterChanged).toHaveBeenCalled();
  });

  it("should call getTableData", () => {
    jest.spyOn(component,'getTableData');
    component.config = mockData.config
    component.rowsData = mockData.rowsData
    component.currentFilters = mockData.filter.allFilters
    component.getTableData();
    expect(component.getTableData).toHaveBeenCalled();
  })
});