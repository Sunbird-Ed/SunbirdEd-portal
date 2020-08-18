import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificateConfigurationComponent } from './certificate-configuration.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { CoreModule } from '@sunbird/core';
import { BrowserCacheTtlService, ConfigService, NavigationHelperService, ToasterService, UtilService, ResourceService } from '@sunbird/shared';
import { CertificateService, UserService, PlayerService, CertRegService } from '@sunbird/core';
import { TelemetryService } from '@sunbird/telemetry'

describe('CertificateConfigurationComponent', () => {
  let component: CertificateConfigurationComponent;
  let fixture: ComponentFixture<CertificateConfigurationComponent>;

  const resourceBundle = {
    frmelmnts: {
      lbl: {
        Select: 'Select',
      },
      cert: {
        lbl: {
          preview: 'preview',
        }
    }
  }
};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, SuiTabsModule, CoreModule,
        FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterModule.forRoot([])],
      declarations: [ CertificateConfigurationComponent ],
      providers: [
        ConfigService,
        NavigationHelperService,
        UtilService,
        CertificateService,
        UserService,
        PlayerService,
        CertRegService,
        BrowserCacheTtlService,
        ToasterService,
        TelemetryService,
        {provide: ResourceService, useValue: resourceBundle}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificateConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('should terminate all subscriptions', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();

  });
});
