import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentActionsComponent } from './content-actions.component';
import { actionsData } from './content-actions.component.spec.data';
import { of, throwError } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ResourceService, ToasterService, NavigationHelperService,
  SharedModule, ServerResponse
} from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PublicPlayerService } from '@sunbird/public';

describe('ContentActionsComponent', () => {
  let component: ContentActionsComponent;
  let fixture: ComponentFixture<ContentActionsComponent>;
  const ActivatedRouteStub = {
    'params': of({ 'collectionId': actionsData.collectionId }),
    snapshot: {
      params: {
        'collectionId': actionsData.collectionId
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContentActionsComponent],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), RouterModule.forRoot([]), SharedModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: ActivatedRouteStub },
        { provide: ResourceService, useValue: actionsData.resourceBundle },
        PublicPlayerService, TelemetryService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentActionsComponent);
    component = fixture.componentInstance;
    component.contentData = actionsData.contentData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
