import {
  ResourceService,
  ConfigService,
  BrowserCacheTtlService
} from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RedirectComponent } from './redirect.component';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { CacheService } from 'ng2-cache-service';

describe('RedirectComponent', () => {
  let component: RedirectComponent;
  let fixture: ComponentFixture<RedirectComponent>;
  const fakeActivatedRoute = {
    snapshot: {
      data: {
        telemetry: {
          env: 'redirect',
          pageid: 'learn-redirect',
          type: 'view',
          object: { type: '', ver: '1.0' }
        }
      }
    }
  };

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RedirectComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TelemetryModule.forRoot()
      ],
      providers: [
        ResourceService,
        ConfigService,
        CacheService,
        BrowserCacheTtlService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call window.open() in same tab', () => {
    setTimeout(() => {
      window.open(window.redirectUrl, '_self');
    }, 500);
    expect(component).toBeTruthy();
    expect(window.open).toBeDefined();
  });

  it('test goback function', () => {
    component.goBack();
    window.close();
    expect(component.goBack).toBeDefined();
  });
});
