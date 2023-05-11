import { ResourceService, ConfigService } from '@sunbird/shared';
import { LocationStrategy } from '@angular/common';
import { AllEvidenceComponent } from './all-evidence.component';
import { DhitiService } from '@sunbird/core';
import { MatTab } from '@angular/material/tabs';

xdescribe('AllEvidenceComponent', () => {
  let component: AllEvidenceComponent;
  const resourceService: Partial<ResourceService> = {};
  const configService:Partial<ConfigService> = {}
  const dhitiService:Partial<DhitiService> = {}
  const locationStratergy:Partial<LocationStrategy> = {
      onPopState:jest.fn as any
  }

  beforeAll(() => {
    component = new AllEvidenceComponent(
      resourceService as ResourceService,
      configService as ConfigService,
      dhitiService as DhitiService,
      locationStratergy as LocationStrategy
    )
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call tabChanged', () => {
    component.tabChanged({tab:{} as MatTab,index:1});
    expect(component.activeIndex).toBe(1)
  });
})