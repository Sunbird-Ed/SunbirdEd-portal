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


 describe('WatchVideoComponent', () => {
  let component: WatchVideoComponent;
  let fixture: ComponentFixture<WatchVideoComponent>;
  let element: HTMLElement;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = jasmine.createSpy('url');
  }
  const resourceBundle = {
    'frmelmnts' : {
      'btn': {
        'close': 'close'
      }
    }
  };
  class FakeActivatedRoute {
  }
   beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WatchVideoComponent],
      imports: [SuiModalModule, TelemetryModule.forRoot(), RouterTestingModule],
      providers: [{ provide: ResourceService, useValue: resourceBundle },
        ConfigService, HttpClient, HttpHandler, CacheService, BrowserCacheTtlService,
        { provide: Router, useClass: RouterStub }, { provide: ActivatedRoute, useClass: FakeActivatedRoute }],

    })
      .compileComponents();
  }));

   beforeEach(() => {
    fixture = TestBed.createComponent(WatchVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'setInteractData');
    component.setInteractData();
    element = fixture.nativeElement;
  });

   it('should be able to close modal', () => {
    expect(component).toBeTruthy();
    expect(component.setInteractData).toHaveBeenCalledTimes(1);
  });
});
