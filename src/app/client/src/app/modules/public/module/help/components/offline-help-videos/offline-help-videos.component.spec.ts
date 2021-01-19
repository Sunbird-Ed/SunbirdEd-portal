import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineHelpVideosComponent } from './offline-help-videos.component';
import { of } from 'rxjs';

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
          't0094': 'How do I load content to the {instance} desktop app?',
          't0095': 'How do I add content to the {instance} desktop app when I am offline or using a pen drive?',
          't0096': 'My Downloads: How do I play content?',
          't0097': 'How do I copy content to my pen drive?'
        },
        vidttl: {
          'copycontent': 'How do I copy content to my pen drive joyful theme',
          'loadcontent': 'How do I load content  to the desktop app joyful theme',
          'playcontent': 'How do I play content joyful theme',
          'downloadcontent': 'How do I download content from desktop app library joyful theme' 
        }
      },
      languageSelected$: of({})
    };
    const routerStub = {
      navigateByUrl: jasmine.createSpy('navigateByUrl')
    };

    TestBed.configureTestingModule({
      declarations: [OfflineHelpVideosComponent],
      imports: [TelemetryModule.forRoot(), HttpClientTestingModule, RouterTestingModule, SharedModule.forRoot()],
      providers: [{ provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceServiceStub },
        { provide: Router, useValue: routerStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineHelpVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should call setVideoHeight method', () => {
    component.instance = resourceServiceStub.instance;
    spyOn(component, 'setVideoHeight');
    spyOn(component, 'interpolateInstance');
    component.ngOnInit();
    expect(component.slideData).toBeDefined();
    expect(component.slideData[0]['id']).toEqual('add-content-offline');
    expect(component.setVideoHeight).toHaveBeenCalled();
    expect(component.interpolateInstance).toHaveBeenCalled();
  });

  xit('should changeVideoAttributes value', () => {
    const name = (resourceServiceStub.frmelmnts.instn.t0094).replace('{instance}', (resourceServiceStub.instance).toUpperCase());
      const data = {
      id: 'add-content-online',
      name: name,
      thumbnail: 'assets/images/play-icon.svg',
      url: 'assets/videos/How_do_I_load_content_to_the_desktop_app.mp4'};
    component.changeVideoAttributes(data);
    fixture.detectChanges();
    const value = fixture.debugElement.query(By.css('.content-video__player__title')).nativeElement.innerText;
    expect(component.activeVideoObject).toBeDefined();
    expect(component.activeVideoObject.id).toEqual('add-content-online');
    expect(value).toContain(data.name);
  });

  xit('should emit an event' , () => {
    spyOn(component.closeVideoModal, 'emit');
    component.closeModal();
    expect(component.closeVideoModal.emit).toHaveBeenCalled();
  });



});
