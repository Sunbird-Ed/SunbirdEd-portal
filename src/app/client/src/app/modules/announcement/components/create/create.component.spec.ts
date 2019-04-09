import { of } from 'rxjs';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { UserService, LearnerService, AnnouncementService, CoreModule } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule, ResourceService, ToasterService, ConfigService } from '@sunbird/shared';
import {
  DetailsComponent, GeoExplorerComponent, CreateComponent, GeoExplorerService, CreateService, FileUploaderComponent
} from '@sunbird/announcement';
import { mockRes } from './create.component.spec.data';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FileUploadService } from './../../services';

describe('CreateComponent', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
  let geoComponent: GeoExplorerComponent;
  let geoFixture: ComponentFixture<GeoExplorerComponent>;
  let router: Router;
  const fakeActivatedRoute = {
    snapshot: {
      params: [
        {
          stepNumber: '1',
        },
        {
          identifier: 'bar',
        },
      ],
      data: {
        telemetry: {
          env: 'announcement', pageid: 'announcement-create', uri: '/announcement/create/',
          type: 'workflow', mode: 'create', object: { type: 'announcement', ver: '1.0' }
        }
      }
    },
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateComponent, GeoExplorerComponent, DetailsComponent, FileUploaderComponent],
      imports: [SuiModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule, SharedModule.forRoot(),
        CoreModule, TelemetryModule.forRoot()],
      providers: [ToasterService, ResourceService, CreateService, UserService,
        LearnerService, AnnouncementService, FileUploadService,
        GeoExplorerService, ConfigService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    geoFixture = TestBed.createComponent(GeoExplorerComponent);
    geoComponent = geoFixture.componentInstance;
    geoFixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('should get already searched announcement types', inject([CreateService],
    (createService) => {
      component.announcementTypes = [];
      createService._announcementTypes = [{ id: '123', name: 'Order' }];
      spyOn(component, 'setAnnouncementTypes').and.callThrough();
      component.setAnnouncementTypes();
      expect(component.setAnnouncementTypes).toHaveBeenCalled();
      expect(component.announcementTypes.length).not.toEqual(0);
    }));

  it('should return selected recipients', inject([],
    () => {
      spyOn(component, 'navigateToWizardNumber').and.callThrough();
      const resourceService = TestBed.get(ResourceService);
      resourceService.messages = mockRes.resourceBundle.messages;
      spyOn(component, 'confirmRecipients').and.callThrough();
      component.confirmRecipients();
      fixture.detectChanges();
      expect(component.navigateToWizardNumber).not.toHaveBeenCalled();
    }));

  it('should redirect to announcement/resend/1234/1', inject([Router],
    (route) => {
      component.identifier = '1234';
      spyOn(component, 'navigateToWizardNumber').and.callThrough();
      component.navigateToWizardNumber(2);
      fixture.detectChanges();
      expect(component.navigateToWizardNumber).toHaveBeenCalled();
      expect(route.navigate).toHaveBeenCalledWith(['announcement/resend', component.identifier, 2]);
    }));

  it('should redirect to announcement/create/1234/1', inject([Router],
    (route) => {
      spyOn(component, 'navigateToWizardNumber').and.callThrough();
      component.navigateToWizardNumber(1);
      fixture.detectChanges();
      expect(component.navigateToWizardNumber).toHaveBeenCalled();
      expect(route.navigate).toHaveBeenCalledWith(['announcement/create', 1]);
    }));

  it('should remove recipients and redirect to form step number 2 ', inject([Router],
    (route) => {
      spyOn(component, 'removeRecipient').and.callThrough();
      spyOn(component, 'navigateToWizardNumber').and.callThrough();
      const resourceService = TestBed.get(ResourceService);
      resourceService.messages = mockRes.resourceBundle.messages;
      component.recipientsList = [mockRes.getLocationDetails];
      component.removeRecipient(mockRes.getLocationDetails);
      fixture.detectChanges();
      expect(component.navigateToWizardNumber).toHaveBeenCalled();
      expect(route.navigate).toHaveBeenCalledWith(['announcement/create', 2]);

    }));

  it('should redirect announcement preview page', inject([Router],
    (route) => {
      spyOn(component, 'navigateToPreviewPage').and.callThrough();
      spyOn(component, 'setResendFormValues').and.callThrough();
      spyOn(component, 'navigateToWizardNumber').and.callThrough();
      component.setResendFormValues(mockRes.resendAnnouncement);
      component.navigateToPreviewPage();
      fixture.detectChanges();
      expect(component.navigateToWizardNumber).toHaveBeenCalled();
      expect(route.navigate).toHaveBeenCalledWith(['announcement/create', 4]);
    }));

  it('should enable recipients button', inject([Router],
    (route) => {
      component.formErrorFlag = true;
      spyOn(component, 'enableSelectRecipientsBtn').and.callThrough();
      spyOn(component, 'setResendFormValues').and.callThrough();
      component.setResendFormValues(mockRes.resendAnnouncement);
      const data = component.enableSelectRecipientsBtn();
      fixture.detectChanges();
      expect(component.setResendFormValues).toHaveBeenCalled();
      expect(data).toEqual(false);
    }));

  it('should not enable recipients button when empty title is passed', inject([],
    () => {
      component.announcementForm = component.sbFormBuilder.group({
        title: [''], from: ['test user'], type: ['News'], description: ['test']
      });
      const data = component.announcementForm.value;
      spyOn(component, 'enableSelectRecipientsBtn').and.callThrough();
      expect(component.formErrorFlag).toEqual(true);
    }));

  it('should not enable recipients button', inject([Router],
    (route) => {
      spyOn(component, 'enableSelectRecipientsBtn').and.callThrough();
      spyOn(component, 'setResendFormValues').and.callThrough();
      // Set empty value
      const data = mockRes.resendAnnouncement;
      data.description = ''; data.links = []; data.attachments = [];
      component.setResendFormValues(data);
      const res = component.enableSelectRecipientsBtn();
      fixture.detectChanges();
      expect(component.setResendFormValues).toHaveBeenCalled();
      expect(res).toEqual(true);
    }));

  xit('should validate form state/data and redirect to step 1', inject([Router],
    (route) => {
      spyOn(component, 'setResendFormValues').and.callThrough();
      spyOn(component, 'navigateToWizardNumber').and.callThrough();
      // Set empty value
      const data = mockRes.resendAnnouncement;
      data.description = ''; data.links = []; data.attachments = [];
      component.setResendFormValues(data);
      component.navigateToWizardNumber(1);
      fixture.detectChanges();
      expect(component.setResendFormValues).toHaveBeenCalled();
      expect(component.navigateToWizardNumber).toHaveBeenCalledWith(1);
      expect(route.navigate).toHaveBeenCalledWith(['announcement/create', 1]);
    }));
  it('should call ngOninit', inject([UserService],
    (userService) => {
      userService._userData$.next({ err: null, userProfile: mockRes.userdata });
      spyOn(component, 'initializeFormFields').and.callThrough();
      spyOn(component, 'setAnnouncementTypes').and.callThrough();
      component.ngOnInit();
      expect(component.showAnnouncementForm).toBeFalsy();
      expect(component.initializeFormFields).toHaveBeenCalled();
      expect(component.setAnnouncementTypes).toHaveBeenCalled();
    }));
  it('should call ngOninit throw error', inject([UserService, ResourceService, ToasterService],
    (userService, resourceService, toasterService) => {
      userService._userData$.next({ err: { msg: 'internal error' }, userProfile: null });
      spyOn(toasterService, 'error').and.callThrough();
      component.ngOnInit();
      expect(component.showAnnouncementForm).toBeFalsy();
      expect(toasterService.error).toHaveBeenCalledWith(resourceService.messages.emsg.m0005);
    }));
  it('should unsubscribe to userData observable', () => {
    component.ngOnInit();
    spyOn(component.userDataSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.userDataSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should unsubscribe from all observable subscriptions', () => {
    component.setAnnouncementTypes();
    component.getAnnouncementDetails();
    spyOn(component.unsubscribe, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe.complete).toHaveBeenCalled();
  });
  it('should get searched announcement types when data is not present and make api call', inject([CreateService],
    (createService) => {
      component.announcementTypes = [];
      spyOn(createService, 'getAnnouncementTypes').and.returnValue(of(mockRes.createSucess));
      spyOn(component, 'setAnnouncementTypes').and.callThrough();
      component.setAnnouncementTypes();
      expect(component.setAnnouncementTypes).toHaveBeenCalled();
      expect(component.showResendLoader).toBeFalsy();
      expect(component.announcementTypes.length).toBeGreaterThan(0);
    }));
    it('should call ngOnint to set telemetry Start data with device info', inject([DeviceDetectorService],
      (deviceDetectorService) => {
        const deviceInfo = deviceDetectorService.getDeviceInfo();
        expect(component.telemetryStart).toBeDefined();
        expect(component.telemetryStart.edata.uaspec['agent']).toBe(deviceInfo.browser);
        expect(component.telemetryStart.edata.uaspec['ver']).toBe(deviceInfo.browser_version);
        expect(component.telemetryStart.edata.uaspec['system']).toBe(deviceInfo.os_version);
        expect(component.telemetryStart.edata.uaspec['platform']).toBe(deviceInfo.os);
        expect(component.telemetryStart.edata.uaspec['raw']).toBe(deviceInfo.userAgent);
    }));
});
