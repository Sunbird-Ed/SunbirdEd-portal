import {
  ResourceService,
  ConfigService,
  BrowserCacheTtlService,
  ToasterService,
  NavigationHelperService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RedirectComponent } from './redirect.component';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { CacheService } from 'ng2-cache-service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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
 const resourceBundle = {
        'messages': {
            'imsg': {
                'm0034': 'As the content is from an external source, it will be opened in a while.'
            },
            'stmsg': { 'm0009': 'Unable to play, please try again or close' }
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
        ToasterService,
        BrowserCacheTtlService,
        NavigationHelperService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedirectComponent);
    component = fixture.componentInstance;
  });

  it('should display the toaster messsage', inject(
    [Router, ToasterService, ResourceService],
    (router, toasterService, resourceService, service) => {
      resourceService.messages = resourceBundle.messages;
      spyOn(toasterService, 'warning').and.callFake(() => 'warning');
      spyOn(component, 'openWindow').and.callFake(() => 'open');
      component.ngOnInit();
      expect(toasterService.warning).toBeDefined();
      expect(toasterService.warning).toHaveBeenCalledWith(resourceService.messages.imsg.m0034);
    }
  ));

});

