import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { TelemetryService, TelemetryModule } from '@sunbird/telemetry';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { OfflineHelpVideosComponent } from './offline-help-videos.component';
import { CacheService } from 'ng2-cache-service';

describe('OfflineHelpVideosComponent', () => {
  let component: OfflineHelpVideosComponent;
  let fixture: ComponentFixture<OfflineHelpVideosComponent>;
  let resourceServiceStub;
  beforeEach(async(() => {
    const fakeActivatedRoute = {
      snapshot: {
        data: {
          telemetry: {
            env: 'help', pageid: 'help', type: 'view'
          }
        }
      }
    };
    resourceServiceStub = {
      instance: 'sunbird',
      frmelmnts: {
        instn: {
          't0094': 'How do I add content to the {instance} desktop app when I am connected to the Internet?',
          't0095': 'How do I add content to the {instance} desktop app when I am offline or using a pen drive?',
          't0096': 'My Library: How and where can I find content in My Library?',
          't0097': 'How do I copy content to my pen drive?'
        }
      }
    };
    const routerStub = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    TestBed.configureTestingModule({
      declarations: [OfflineHelpVideosComponent],
      imports: [TelemetryModule, HttpClientTestingModule, RouterTestingModule],
      providers: [TelemetryService, ConfigService, CacheService, BrowserCacheTtlService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceServiceStub },
        { provide: Router, useValue: routerStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineHelpVideosComponent);
    component = fixture.componentInstance;
    spyOn(component, 'setVideoAspectRatio').and.callFake(() => {});
    spyOn(component, 'onWindowResize').and.callFake(() => {});
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize slide data', fakeAsync(() => {
    const resourceService = TestBed.get(ResourceService);
    resourceService.instance = resourceServiceStub.instance;
    resourceService.frmelmnts = resourceServiceStub.frmelmnts;
    component.ngOnInit();
    tick(600);
    expect(component.slideData).toBeDefined();
  }));
  it('should changeVideoAttributes value', fakeAsync(() => {
    const data = component.slideData[0];
    component.changeVideoAttributes(data);
    tick(600);
    expect(component.activeVideoObject).toBeDefined();
  }));

  it('should emit an event' , fakeAsync(() => {
    spyOn(component.closeVideoModal, 'emit');
    component.closeModal();
    tick(600);
    expect(component.closeVideoModal.emit).toHaveBeenCalled();
  }));

});
