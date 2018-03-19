import { mockRes } from './../details/details.component.spec.data';
import { async, ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, NgForm, FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SuiModule } from 'ng2-semantic-ui';
import { Ng2IziToastModule } from 'ng2-izitoast';

import { CreateComponent } from './create.component';
import { GeoExplorerComponent } from './../geo-explorer/geo-explorer.component';
import { CreateService, GeoExplorerService } from './../../services';
import { UserService, LearnerService, AnnouncementService } from '@sunbird/core';
import { IGeoLocationDetails } from './../../interfaces';

import { SharedModule, ResourceService, ToasterService } from '@sunbird/shared';
import { DetailsComponent } from '@sunbird/announcement';
import { Observable } from 'rxjs/Observable';
import * as testData from './create.component.spec.data';


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
    },
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateComponent, GeoExplorerComponent, DetailsComponent],
      imports: [SuiModule, FormsModule, ReactiveFormsModule, HttpClientTestingModule, SharedModule,
        Ng2IziToastModule],
      providers: [ToasterService, ResourceService, CreateService, UserService, LearnerService, AnnouncementService,
        GeoExplorerService, HttpClient,
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

  it('should get resend announcement data', inject([Router, CreateService, AnnouncementService],
    (route, createService, announcementService) => {
      component.isMetaModified = false;
      component.showLoader = true;
      component.identifier = 'do_12345';
      const response = { result: { announcement: testData.mockRes.resendAnnouncement } };
      spyOn(component, 'getAnnouncementDetails').and.callThrough();
      spyOn(component, 'setResendFormValues').and.callThrough();
      spyOn(component, 'enableRecipientsBtn').and.callThrough();
      spyOn(createService, 'resendAnnouncement').and.callFake(() => Observable.of(response));
      component.getAnnouncementDetails();
      fixture.detectChanges();
      expect(component.getAnnouncementDetails).toHaveBeenCalled();
      expect(createService.resendAnnouncement).toHaveBeenCalledWith(component.identifier);
      expect(component.setResendFormValues).toHaveBeenCalledWith(response.result.announcement);
      expect(component.enableRecipientsBtn).toHaveBeenCalledWith();
      expect(component.showLoader).toEqual(false);
    }));

  xit('should get announcement types', inject([Router, CreateService, AnnouncementService],
    (route, createService, announcementService) => {
      component.isMetaModified = false;
      const data = { result: { announcementTypes: testData.mockRes.announcementTypes } };
      spyOn(component, 'setAnnouncementTypes').and.callThrough();
      spyOn(createService, 'getAnnouncementTypes').and.callFake(() => Observable.of(data));
      component.setAnnouncementTypes();
      fixture.detectChanges();
      expect(component.setAnnouncementTypes).toHaveBeenCalled();
    }));

  it('should get already searched announcement types', inject([CreateService],
    (createService) => {
      component.announcementTypes = [];
      createService._announcementTypes = [{ id: '123', name: 'Order' }];
      spyOn(component, 'setAnnouncementTypes').and.callThrough();
      component.setAnnouncementTypes();
      fixture.detectChanges();
      expect(component.setAnnouncementTypes).toHaveBeenCalled();
      expect(component.announcementTypes.length).not.toEqual(0);
    }));

  it('should add new link', inject([CreateService],
    (createService) => {
      spyOn(component, 'addNewLink').and.callThrough();
      component.addNewLink('http://www.google.com');
      fixture.detectChanges();
      const data = component.announcementForm.value;
      expect(data.links.length).toEqual(1);
      expect(data.links.length).not.toBe(0);
    }));

  it('It should remove link', inject([CreateService],
    (createService) => {
      spyOn(component, 'addNewLink').and.callThrough();
      component.addNewLink('http://www.google.com');
      spyOn(component, 'removeLink').and.callThrough();
      component.removeLink(0);
      fixture.detectChanges();
      const data = component.announcementForm.value;
      expect(data.links.length).toEqual(0);
      expect(data.links.length).not.toBe(1);
    }));

  it('should return selected recipients', inject([HttpClient, ResourceService],
    (http, resourceService) => {
      spyOn(http, 'get').and.callFake(() => Observable.of(testData.mockRes.resourceBundle));
      spyOn(component, 'navigateToWizardNumber').and.callThrough();
      http.get().subscribe(
        data => {
          resourceService.messages = data.messages;
        }
      );
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

  it('should remove recipients and redirect to form step number 2 ', inject([Router, HttpClient, ResourceService],
    (route, http, resourceService) => {
      spyOn(http, 'get').and.callFake(() => Observable.of(testData.mockRes.resourceBundle));
      spyOn(component, 'removeRecipient').and.callThrough();
      spyOn(component, 'navigateToWizardNumber').and.callThrough();
      http.get().subscribe(
        data => {
          resourceService.messages = data.messages;
          component.recipientsList = [testData.mockRes.getLocationDetails];
          component.removeRecipient(testData.mockRes.getLocationDetails);
          fixture.detectChanges();
          expect(component.navigateToWizardNumber).toHaveBeenCalled();
          expect(route.navigate).toHaveBeenCalledWith(['announcement/create', 2]);
        }
      );
    }));

  it('should redirect announcement preview page', inject([Router],
    (route) => {
      spyOn(component, 'navigateToPreviewPage').and.callThrough();
      spyOn(component, 'setResendFormValues').and.callThrough();
      spyOn(component, 'navigateToWizardNumber').and.callThrough();
      component.setResendFormValues(testData.mockRes.resendAnnouncement);
      component.navigateToPreviewPage();
      fixture.detectChanges();
      expect(component.navigateToWizardNumber).toHaveBeenCalled();
      expect(route.navigate).toHaveBeenCalledWith(['announcement/create', 4]);
    }));

  it('should enable recipients button', inject([Router],
    (route) => {
      component.formErrorFlag = true;
      spyOn(component, 'enableRecipientsBtn').and.callThrough();
      spyOn(component, 'setResendFormValues').and.callThrough();
      component.setResendFormValues(testData.mockRes.resendAnnouncement);
      const data = component.enableRecipientsBtn();
      fixture.detectChanges();
      expect(component.setResendFormValues).toHaveBeenCalled();
      expect(data).toEqual(false);
    }));

  it('should not enable recipients button', inject([Router],
    (route) => {
      spyOn(component, 'enableRecipientsBtn').and.callThrough();
      spyOn(component, 'setResendFormValues').and.callThrough();
      // Set empty value
      const data = testData.mockRes.resendAnnouncement;
      data.description = ''; data.links = []; data.attachments = [];
      component.setResendFormValues(data);
      const res = component.enableRecipientsBtn();
      fixture.detectChanges();
      expect(component.setResendFormValues).toHaveBeenCalled();
      expect(res).toEqual(true);
    }));

  it('should validate form state/data and redirect to step 1', inject([Router],
    (route) => {
      spyOn(component, 'setResendFormValues').and.callThrough();
      spyOn(component, 'navigateToWizardNumber').and.callThrough();
      // Set empty value
      const data = testData.mockRes.resendAnnouncement;
      data.description = ''; data.links = []; data.attachments = [];
      component.setResendFormValues(data);
      component.navigateToWizardNumber(1);
      fixture.detectChanges();
      expect(component.setResendFormValues).toHaveBeenCalled();
      expect(component.navigateToWizardNumber).toHaveBeenCalledWith(1);
      expect(route.navigate).toHaveBeenCalledWith(['announcement/create', 1]);
    }));
});
