import { TelemetryService } from '@sunbird/telemetry';
import { ConfigService, ResourceService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { AddToGroupDirective, csGroupServiceFactory } from './add-to-group.directive';
import { TestBed } from '@angular/core/testing';
import { HttpHandler } from '@angular/common/http';
import { CacheService } from 'ng2-cache-service';
import { BrowserCacheTtlService, UtilService } from '../../services';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

describe('AddToGroupDirective', () => {
  let directive: AddToGroupDirective;

  class ResourceServiceStub {
  }

  class RouterStub {

  }

  const fakeActivatedRoute = {

  };

  const elementRefStub = { nativeElement: { 'lang': 'en', 'dir': 'ltr' } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ ],
      providers: [
        HttpClientTestingModule,
        HttpHandler,
        CacheService,
        BrowserCacheTtlService,
        AddToGroupDirective,
        ConfigService,
        NavigationHelperService,
        UtilService,
        ToasterService,
        TelemetryService,
        { provide: ResourceService, useClass: ResourceServiceStub },
        { provide: ElementRef, useValue: elementRefStub },
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute},
        { provide: 'CS_GROUP_SERVICE', useFactory: csGroupServiceFactory}
      ]
    });
    directive = TestBed.get(AddToGroupDirective);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should add activity to the group', () => {
    /** Arrange */
    spyOn(directive, 'sendInteractData').and.stub();
    directive.groupAddableBlocData = {};

    /** Act */
    directive.addActivityToGroup();

    /** Assert */
    expect(directive.sendInteractData).toHaveBeenCalled();

  });
});
