import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { ResourceReorderComponent } from './resource-reorder.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { CollectionHierarchyService } from '../../services/collection-hierarchy/collection-hierarchy.service';
import {
  ResourceService, ToasterService, SharedModule, ConfigService, UtilService, BrowserCacheTtlService
} from '@sunbird/shared';
import { CacheService } from 'ng2-cache-service';
import { TelemetryService } from '@sunbird/telemetry';
import { of as observableOf, throwError as observableError } from 'rxjs';
import { ActionService } from '@sunbird/core';

describe('ResourceReorderComponent', () => {
  let component: ResourceReorderComponent;
  let fixture: ComponentFixture<ResourceReorderComponent>;
  let debugElement: DebugElement;
  let errorInitiate;
  let errorInitiate1;
  const actionServiceStub = {
    patch() {
      if (errorInitiate) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf('Success');
      }
    },
    delete() {
      if (errorInitiate1) {
        return observableError({ result: { responseCode: 404 } });
      } else {
        return observableOf('Success');
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, FormsModule, HttpClientTestingModule],
      declarations: [ ResourceReorderComponent ],
      providers: [CollectionHierarchyService, ConfigService, UtilService, ToasterService, TelemetryService,
                       ResourceService, CacheService, BrowserCacheTtlService, { provide: ActionService, useValue: actionServiceStub }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceReorderComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    component.programContext = {};
    component.programContext['collection'] = 'do_1127639035982479361130';
    component.unitSelected = 'do_11282684038818201618';
    component.contentId = 'do_112797719109984256198';
    component.prevUnitSelect = 'do_112826840689098752111';
    fixture.detectChanges();
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
      expect(component.toasterService.success).toHaveBeenCalledWith('The Selected Resource is Successfuly Moved');
  });

  it('should not execute removeResource method if addResource fails', () => {
    errorInitiate = true;
    fixture.detectChanges();
    spyOn(component.toasterService, 'success');
    debugElement
      .query(By.css('#moveResource'))
      .triggerEventHandler('click', null);
      expect(component.toasterService.success).not.toHaveBeenCalledWith('The Selected Resource is Successfuly Moved');
  });
});
