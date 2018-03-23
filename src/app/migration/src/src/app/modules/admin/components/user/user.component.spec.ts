import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { LearnerService, OrgManagementService } from '@sunbird/core';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService, ToasterService, RouterNavigationService, ServerResponse, ConfigService } from '@sunbird/shared';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { NgForm, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { UserComponent } from './user.component';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserComponent],
      imports: [SuiModule, HttpClientTestingModule, Ng2IziToastModule],
      providers: [Ng2IzitoastService, OrgManagementService, ConfigService, ToasterService, ResourceService, LearnerService, FormBuilder, HttpClient,
        { provide: Router, useClass: RouterStub }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call redirect', inject([Router], (router) => {
    spyOn(component, 'redirect').and.callThrough();
    component.redirect();
    fixture.detectChanges();
    expect(component.redirect).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['admin/bulkUpload']);
  }));
  xit('should call downloadSample method to download a csv file', () => {
    spyOn(component, 'downloadSample').and.callThrough();
    component.downloadSample();
    fixture.detectChanges();
    expect(component.downloadSample).toHaveBeenCalled();
  });
  it('should call openImageBrowser method', () => {
    component.uploadUserForm.value.provider = 1234;
    component.uploadUserForm.value.externalId = 5678;
    component.uploadUserForm.value.organizationId = 98765;
    component.openImageBrowser('user');
    fixture.detectChanges();
    spyOn(component, 'openImageBrowser').and.callThrough();
  });
  it('should not call openImageBrowser method', () => {
    spyOn(component, 'openImageBrowser').and.callThrough();
    component.openImageBrowser('user');
    fixture.detectChanges();
    expect(component.bulkUploadError).toBe(true);
  });
  it('should call closeBulkUploadError method', () => {
    spyOn(component, 'closeBulkUploadError').and.callThrough();
    expect(component.closeBulkUploadError).toHaveBeenCalled();
    expect(component.showLoader).toBe(false);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  })
});
