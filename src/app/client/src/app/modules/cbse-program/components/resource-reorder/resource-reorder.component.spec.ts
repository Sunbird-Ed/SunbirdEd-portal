import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { ResourceReorderComponent } from './resource-reorder.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import {
  ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService
} from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { TelemetryService } from '@sunbird/telemetry';
import { ProgramTelemetryService } from '../../../program/services';
import { of as observableOf, throwError as observableError } from 'rxjs';
import { ActionService } from '@sunbird/core';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';

describe('ResourceReorderComponent', () => {
  let component: ResourceReorderComponent;
  let fixture: ComponentFixture<ResourceReorderComponent>;
  let debugElement: DebugElement;
  let errorInitiate;
  const errorInitiate1 = false;
  const hierarchyServiceStub: any = {};
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, CoreModule,
        FormsModule, HttpClientTestingModule, RouterModule.forRoot([]), TelemetryModule.forRoot()],
      declarations: [ ResourceReorderComponent ],
      providers: [ProgramTelemetryService, ConfigService, UtilService, ToasterService, TelemetryService,
                       ResourceService, CacheService, BrowserCacheTtlService,
                       {provide: CollectionHierarchyService, useValue: hierarchyServiceStub}]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceReorderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.sessionContext = {};
    component.sessionContext['collection'] = 'do_1127639035982479361130';
    component.unitSelected = 'do_11282684038818201618';
    component.contentId = 'do_112797719109984256198';
    component.prevUnitSelect = 'do_112826840689098752111';
    component.programContext =  {
        'userDetails': {
          'enrolledOn': '2019-12-27T09:13:33.742Z',
          'onBoarded': true,
          'onBoardingData': {
            'school': 'My School'
          },
          'programId': '18cc8a70-2889-11ea-9bc0-fd6cea67ce9f',
          'roles': [
            'CONTRIBUTOR'
          ],
          'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e'
        }
      };
    fixture.detectChanges();
  });

  beforeAll(() => {
    hierarchyServiceStub.addResourceToHierarchy = jasmine.createSpy(' addHierarchySpy').and.callFake(() => {
      if (errorInitiate) {
              return observableError({ result: { responseCode: 404 } });
            } else {
              return observableOf('Success');
            }
    });
    hierarchyServiceStub.removeResourceToHierarchy = jasmine.createSpy(' removeHierarchySpy').and.callFake(() => {
      if (errorInitiate) {
              return observableError({ result: { responseCode: 404 } });
            } else {
              return observableOf('Success');
            }
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute moveResource method successfully', () => {
    fixture.detectChanges();
    spyOn(component.toasterService, 'success');
    debugElement
      .query(By.css('#moveResource'))
      .triggerEventHandler('click', null);
      expect(component.toasterService.success).toHaveBeenCalledWith('The Selected Resource is Successfully Moved');
  });
  it('should not execute removeResource method if addResource fails', () => {
    errorInitiate = true;
    fixture.detectChanges();
    spyOn(component.toasterService, 'success');
    debugElement
      .query(By.css('#moveResource'))
      .triggerEventHandler('click', null);
      expect(component.toasterService.success).not.toHaveBeenCalled();
  });
});
