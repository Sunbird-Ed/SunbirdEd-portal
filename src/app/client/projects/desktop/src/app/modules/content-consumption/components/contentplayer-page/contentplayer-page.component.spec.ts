import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPlayerPageComponent } from './contentplayer-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicPlayerService } from '@sunbird/public';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { of, throwError } from 'rxjs';
import { resourceData } from './contentplayer-page.component.spec.data';
import { TelemetryModule } from '@sunbird/telemetry';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
describe('ContentPlayerPageComponent', () => {
  let component: ContentPlayerPageComponent;
  let fixture: ComponentFixture<ContentPlayerPageComponent>;
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
      declarations: [ContentPlayerPageComponent],
      imports: [HttpClientTestingModule, TelemetryModule.forRoot(), RouterModule.forRoot([]), SharedModule.forRoot()],
      providers: [
        { provide: ActivatedRoute, useValue: ActivatedRouteStub },
        { provide: ResourceService, useValue: resourceData.resourceBundle },
        PublicPlayerService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPlayerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getContent method succssfully geting content', () => {
    const publicService = TestBed.get(PublicPlayerService);
    spyOn(publicService, 'getContent').and.returnValue(of(resourceData.content));
    component.getContent(resourceData.contentId);
    expect(component.contentDetails).toEqual(resourceData.content.result.content);
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.setTelemetryData();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });
  it('should call getContent method and error while getting content ', () => {
    const publicService = TestBed.get(PublicPlayerService);
    spyOn(publicService, 'getContent').and.returnValue(throwError(resourceData.contentError));
    spyOn(component.toasterService, 'error').and.returnValue(of(resourceData.resourceBundle.messages.emsg.m0024));
    component.getContent(resourceData.contentId);
    expect(component.toasterService.error).toHaveBeenCalledWith(resourceData.resourceBundle.messages.emsg.m0024);
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.setTelemetryData();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });
  it('should get content config details ', () => {
    const publicService = TestBed.get(PublicPlayerService);
    spyOn(publicService, 'getConfig').and.returnValue(resourceData.configDetails);
    component.contentDetails = resourceData.content.result.content;
    component.getContentConfigDetails(resourceData.contentId);
    expect(component.playerConfig).toEqual(resourceData.configDetails);
  });
  it('should call setTelemetryData', () => {
    spyOn(component, 'setTelemetryData').and.callThrough();
    component.setTelemetryData();
    expect(component.setTelemetryData).toHaveBeenCalled();
  });
  it('should call prepareVisits method', () => {
    component.telemetryImpression.edata.visits = [];
    component.contentDetails = resourceData.content.result.content;
    component.prepareVisits();
    expect(component.telemetryImpression.edata.visits).toEqual(resourceData.visits);
    expect(component.telemetryImpression.edata.subtype).toEqual('pageexit');
  });
});
