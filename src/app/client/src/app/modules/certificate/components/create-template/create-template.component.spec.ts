import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateTemplateComponent } from './create-template.component';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, ElementRef } from '@angular/core';
import { BrowserCacheTtlService, ConfigService, NavigationHelperService, ToasterService, UtilService, ResourceService } from '@sunbird/shared';
import { UserService, PlayerService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheService } from 'ng2-cache-service';
import { CoreModule } from '@sunbird/core';
import { configureTestSuite } from '@sunbird/test-util';




describe('CreateTemplateComponent', () => {
  let component: CreateTemplateComponent;
  let fixture: ComponentFixture<CreateTemplateComponent>;
  configureTestSuite();

  const resourceBundle = {
    frmelmnts: {
  },
  messages: {
    
  }
};

const fakeActivatedRoute = {
  snapshot: {
    data: {
      telemetry: {
        env: 'certs',
        pageid: 'certificate-configuration',
        type: 'view',
        subtype: 'paginate',
        ver: '1.0'
      }
    }
  }
};

class RouterStub {
  public url = '/cert/configure/add';
  navigate = jasmine.createSpy('navigate');
}

const elementRefStub = {
  nativeElement: {
    'lang': 'en',
    'dir': 'ltr',
    style: {
      display: 'none'
    }
  }
};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule, CoreModule, ReactiveFormsModule, HttpClientTestingModule, RouterModule.forRoot([]) ],
      declarations: [ CreateTemplateComponent ],
      providers: [
        ConfigService,
        NavigationHelperService,
        UtilService,
        BrowserCacheTtlService,
        ToasterService,
        TelemetryService,
        CacheService,
        {provide: ResourceService, useValue: resourceBundle},
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub},
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTemplateComponent);
    component = fixture.componentInstance;
    component.defaultCertificates = [
      { path: 'assets/images/mp.svg', id: 0 },
      { path: 'assets/images/odisha.svg', id: 1 },
      { path: 'assets/images/jh.svg', id: 2 }];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should terminate all subscriptions', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it('on init', () => {
    const navigationHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigationHelperService, 'setNavigationUrl').and.stub();
    component.ngOnInit();
    expect(navigationHelperService.setNavigationUrl).toHaveBeenCalled();
  });

});
