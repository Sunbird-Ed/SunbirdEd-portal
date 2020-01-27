import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CacheService } from 'ng2-cache-service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { WatchVideoComponent } from './watch-video.component';
import { SuiModalModule } from 'ng2-semantic-ui';
import { TelemetryModule } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import { SlickModule } from 'ngx-slick';

const resourceServiceMockData = {
  frmelmnts: {
    instn: {
      t0094: 'How to Download Content',
      t0095: 'How to Copy Content from Pendrive',
      t0096: 'How to Browse for Content Online',
      t0097: 'How to Play Content'
    }
  }
};

 describe('WatchVideoComponent', () => {
  let component: WatchVideoComponent;
  let fixture: ComponentFixture<WatchVideoComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  class FakeActivatedRoute {
  }
   beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WatchVideoComponent],
      imports: [SuiModalModule, TelemetryModule.forRoot(), RouterTestingModule, SlickModule],
      providers: [ { provide: ResourceService, useValue: resourceServiceMockData },
        ConfigService, HttpClient, HttpHandler, CacheService, BrowserCacheTtlService,
        { provide: Router, useClass: RouterStub }, { provide: ActivatedRoute, useClass: FakeActivatedRoute }],

    })
      .compileComponents();
  }));

   beforeEach(() => {
    fixture = TestBed.createComponent(WatchVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call ngoninit', () => {
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.slideConfig).toBeDefined();
    expect(component.slideData).toBeDefined();
  });

  it('should emit on close modal', () => {
    spyOn(component.closeVideoModal, 'emit');
    component.closeModal();
    expect(component.closeVideoModal.emit).toHaveBeenCalledWith('success');
 });
});
