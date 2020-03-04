import { RouterTestingModule } from '@angular/router/testing';
import { async, ComponentFixture, TestBed, ComponentFixtureAutoDetect } from '@angular/core/testing';
import { ContentImportHeaderComponent } from './content-import-header.component';
import { SuiModalModule } from 'ng2-semantic-ui';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule, TelemetryService, TELEMETRY_PROVIDER  } from '@sunbird/telemetry';
import { WatchVideoComponent } from '../watch-video/watch-video.component';
import { SlickModule } from 'ngx-slick';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ContentImportHeaderComponent', () => {
  let component: ContentImportHeaderComponent;
  let fixture: ComponentFixture<ContentImportHeaderComponent>;
  let resourceService: ResourceService;
  let resourceServiceStub;
  beforeEach(async(() => {
  resourceServiceStub   = {
      instance: 'sunbird'
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SuiModalModule, SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule, SlickModule],
      declarations: [ContentImportHeaderComponent, WatchVideoComponent],
      providers: [{provide: ResourceService, useValue: resourceServiceStub},
        TelemetryService, { provide: TELEMETRY_PROVIDER, useValue: EkTelemetry }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentImportHeaderComponent);
    component = fixture.componentInstance;
    resourceService = TestBed.get(ResourceService);
    fixture.detectChanges();
    spyOn(component, 'setInteractData');
    component.setInteractData();
  });
  it('should call setInteractMethod and should get instance', () => {
    expect(component).toBeTruthy();
    expect(component.setInteractData).toHaveBeenCalled();
  });
  it('should get instance', () => {
    expect(component.setInteractData).toHaveBeenCalled();
    (resourceService.instance as string) = resourceServiceStub.instance;
    expect(component.instance).toEqual('SUNBIRD');
  });
  it('Call handleImportContentDialog when click on load content', () => {
    component.handleImportContentDialog();
    expect(component.showLoadContentModal).toBeTruthy();
});

it('Call closeLoadContentModal when modal closes', () => {
    component.showLoadContentModal = true;
    component.handleImportContentDialog();
    expect(component.showLoadContentModal).toBeFalsy();
});
  });
