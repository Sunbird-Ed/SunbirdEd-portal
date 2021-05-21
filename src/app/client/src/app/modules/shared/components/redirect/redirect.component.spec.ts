import {
  ResourceService,
  ConfigService,
  BrowserCacheTtlService,
  ToasterService,
  NavigationHelperService, UtilService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { RedirectComponent } from './redirect.component';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryModule } from '@sunbird/telemetry';
import { Observable } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { CacheService } from 'ng2-cache-service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { configureTestSuite } from '@sunbird/test-util';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

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

  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RedirectComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
           loader: {
              provide: TranslateLoader,
              useClass: TranslateFakeLoader
           }
        }),
        TelemetryModule.forRoot(),
      ],
      providers: [
        ResourceService,
        ConfigService,
        CacheService,
        ToasterService,
        BrowserCacheTtlService,
        NavigationHelperService,
        UtilService,
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

  it('should redirect', fakeAsync(() => {
    window.redirectUrl = '/';
    spyOn(window, 'open');
    component.openWindow();
    tick(1500);
    expect(window.open).toHaveBeenCalledWith('/', '_self');
  }));

  it('should initialize telemetryImpression', fakeAsync(() => {
    spyOn(component.navigationhelperService, 'getPageLoadTime').and.returnValue(2);
    window.redirectUrl = '/home';
    component.ngAfterViewInit();
    tick(100);

    expect(component.telemetryImpression).toEqual({
      context: {
        env: 'redirect'
      },
      edata: {
        type: 'view',
        pageid: 'learn-redirect',
        uri: '/home',
        duration: 2
      }
    });
  }));

  it ('should call close', () => {
    spyOn(window, 'close');
    component.goBack();
    expect(window.close).toHaveBeenCalled();
  });

});

