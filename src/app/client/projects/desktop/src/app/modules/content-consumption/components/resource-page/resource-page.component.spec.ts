import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePageComponent } from './resource-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicPlayerService } from '@sunbird/public';
import { SharedModule } from '@sunbird/shared';
import { of } from 'rxjs';
import {resourceData} from './resource-page.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
describe('ResourcePageComponent', () => {
  let component: ResourcePageComponent;
  let fixture: ComponentFixture<ResourcePageComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const ActivatedRouteStub = {
    'params': of({ 'contentId': resourceData.contentId }),
    snapshot: {
      params: {
        'contentId': resourceData.contentId
      },
      data: {
        telemetry: {
          env: 'player-page', pageid: 'play-content', type: 'view', subtype: 'paginate'
        }
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResourcePageComponent],
      imports: [HttpClientTestingModule,  TelemetryModule.forRoot(), SharedModule.forRoot()],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: ActivatedRouteStub },
        PublicPlayerService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should get content id from activated route', () => {
    fixture.detectChanges();
    expect(component.contentId).toBe(resourceData.contentId);
  });
  it('should call getContent method ', () => {
    const publicService = TestBed.get(PublicPlayerService);
    spyOn(publicService, 'getContent').and.returnValue(of(resourceData.content));
      component.getContent();
      expect(component.contentDetails).toEqual(resourceData.content.result.content);
      spyOn(component, 'setTelemetryData').and.callThrough();
      component.setTelemetryData();
      expect(component.setTelemetryData).toHaveBeenCalled();
  });
  it('should get content config details ', () => {
    const publicService = TestBed.get(PublicPlayerService);
    spyOn(publicService, 'getConfig').and.returnValue(resourceData.configDetails);
    component.contentId = resourceData.contentId;
    component.contentDetails = resourceData.content.result.content;
    component.getContentConfigDetails();
    expect(component.playerConfig).toEqual(resourceData.configDetails);
  });
  it('should call setTelemetryData', () => {
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.setTelemetryData();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });
});
