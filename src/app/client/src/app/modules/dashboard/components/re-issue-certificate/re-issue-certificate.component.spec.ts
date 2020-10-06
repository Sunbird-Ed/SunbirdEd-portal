import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SuiModalModule, SuiPopupModule } from 'ng2-semantic-ui';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReIssueCertificateComponent } from './re-issue-certificate.component';
import { configureTestSuite } from '@sunbird/test-util';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';
import { CertRegService } from '@sunbird/core';

describe('ReIssueCertificateComponent', () => {
  let component: ReIssueCertificateComponent;
  let fixture: ComponentFixture<ReIssueCertificateComponent>;
  let searchBtn;
  configureTestSuite();

  const fakeActivatedRoute = {
    parent: { params: of({ courseId: '123' }) },
    snapshot: {
      data: {
        telemetry: {
          env: 'dashboard', pageid: 'certificates', type: 'view', subtype: 'paginate', object: { type: 'course', ver: '1.0' }
        }
      }
    }
  };

  class RouterStub {
    navigate = jasmine.createSpy('navigate');
    url = 'dashboard/certificates';
  }

  const resourceBundle = {
    messages: {
      dashboard: {
        emsg: {
          m001: 'Could not fetch the certificate list. Try again later',
          m002: 'User is not enrolled in any of the batches of this course',
          m003: 'Could not reissue certificate. Try again later',
          m004: `You haven't created this batch`,
        },
        smsg: {
          m001: 'We have received your request to re-issue your certificate. You will receive the re-issued certificate in 7 working days'
        }
      },
      emsg: {
        m004: 'You have entered an invalid sunbird ID'
      }
    },
    frmelmnts: {
      lbl: {
      }
    },
    instance: 'sunbird'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReIssueCertificateComponent],
      imports: [SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule, SuiModalModule,
        ReactiveFormsModule, FormsModule, SuiPopupModule],
      providers: [TelemetryService, CertRegService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub },
        { provide: ResourceService, useValue: resourceBundle },
        { provide: APP_BASE_HREF, useValue: '/' }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReIssueCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    searchBtn = fixture.debugElement.query(By.css('#search-btn'));
    component.userData = {
      userId: 'testUser',
      userName: 'user',
      district: 'district 1',
      courses: {
        courseId: '123',
        name: 'course 1',
        contentType: 'course',
        pkgVersion: 1,
        batches: [{}]
      }
  };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    spyOn(component, 'setImpressionEvent').and.callThrough();
    component.ngOnInit();
    component['activatedRoute'].parent.params.subscribe(data => {
      expect(component.courseId).toEqual('123');
      expect(component.setImpressionEvent).toHaveBeenCalled();
    });
  });

  it('should return certList with error', () => {
    component.userName = '   testUser';
    spyOn(component['certService'], 'getUserCertList').and.returnValue(
      of({ result: { response: { err: { message: 'Error while fetching cert list' } } } }));
    spyOn(component, 'showErrorMsg');
    spyOn(component, 'modifyCss');
    spyOn(component.button.nativeElement.classList, 'add');
    spyOn(component.button.nativeElement.classList, 'remove');
    component.searchCertificates();
    component['certService'].getUserCertList(component.userName.trim(), '123', 'user1').subscribe(data => {
      expect(component.showErrorMsg).toHaveBeenCalled();
      expect(component.button.nativeElement.disabled).toBeTruthy();
      expect(component.button.nativeElement.classList).toContain('sb-btn-disabled');
      expect(component.modifyCss).toHaveBeenCalled();
      expect(component.button.nativeElement.classList.add).toHaveBeenCalled();
      expect(component.button.nativeElement.classList.remove).toHaveBeenCalled();
    });
    expect(component['certService'].getUserCertList).toHaveBeenCalledWith('testUser', '123', 'user1');
  });

  it('should throw  error while fetching certList', () => {
    component.userName = 'testUser';
    spyOn(component['certService'], 'getUserCertList').and.returnValue(throwError({ result: { response: { err: { message: 'Error while fetching cert list' } } } }));
    spyOn(component, 'showErrorMsg');
    spyOn(component, 'modifyCss');
    component.searchCertificates();
    component['certService'].getUserCertList('testUser', '123', 'user1').subscribe(data => {
    }, err => {
      expect(component.showErrorMsg).toHaveBeenCalled();
      expect(component.modifyCss).toHaveBeenCalled();
    });
    expect(component['certService'].getUserCertList).toHaveBeenCalledWith('testUser', '123', 'user1');
  });

  it('should return  certList with batchList[] empty', () => {
    const certRegService = TestBed.get(CertRegService);
    const response = {
          userId: 'testUser',
          userName: 'user',
          district: 'district 1',
          courses: {
            courseId: '123',
            name: 'course 1',
            contentType: 'course',
            pkgVersion: 1,
            batches: [{}]
          }
    };
    component.userName = 'testUser';
    component['userService'].setUserId('user1');
    spyOn(certRegService, 'checkCriteria').and.stub();
    spyOn(component['certService'], 'getUserCertList').and.returnValue(of(response));
    spyOn(component, 'isErrorOccurred').and.returnValue(false);
    component.searchCertificates();
    component['certService'].getUserCertList('testUser', '123', 'user1').subscribe(data => {
      component.isErrorOccurred(data);
      component.userData = response;
    });
    expect(component.userData).toEqual(response);
    expect(component['certService'].getUserCertList).toHaveBeenCalledWith('testUser', '123', 'user1');
    expect(component.isErrorOccurred).toHaveBeenCalledWith(response);

  });

  it('should return  certList with batchList[]', () => {
    const certRegService = TestBed.get(CertRegService);
    const response = {
      result: {
        response: {
          userId: 'testUser',
          userName: 'user',
          district: 'district 1',
          courses: {
            courseId: '123',
            name: 'course 1',
            contentType: 'course',
            pkgVersion: 1,
            batches: [{
              batchId: '1',
            }]
          }
        }
      }
    };
    component.userName = 'testUser';
    spyOn(certRegService, 'checkCriteria').and.stub();
    spyOn(component['certService'], 'getUserCertList').and.returnValue(of(response));
    component.searchCertificates();
    component['certService'].getUserCertList('testUser', '123', 'user1').subscribe(data => {
      expect(component.userData).toEqual(response.result.response);
      expect(certRegService.checkCriteria).toHaveBeenCalledWith(response.result.response.courses.batches);
    });
    expect(component['certService'].getUserCertList).toHaveBeenCalledWith('testUser', '123', 'user1');
  });


  it ('should classList add()', () => {
    spyOn(component.button.nativeElement.classList, 'add');
    spyOn(component.button.nativeElement.classList, 'remove');
    component.modifyCss();
    expect(component.button.nativeElement.disabled).toBeFalsy();
    expect(component.button.nativeElement.classList.add).toHaveBeenCalledWith('sb-btn-outline-primary');
    expect(component.button.nativeElement.classList.remove).toHaveBeenCalledWith('sb-btn-disabled');
  });

  it('should call toaster service with error msg', () => {
    spyOn(component['toasterService'], 'error');
    component.showErrorMsg(resourceBundle.messages.dashboard.emsg.m001);
    expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.dashboard.emsg.m001);
  });

  it('should reIssue certificate', () => {
    const batch = {batchId: '1', name: 'batch 1', certificates: [], createdBy: '123' };
    component.userData = {
          userId: 'testUser',
          userName: 'user',
          district: 'district 1',
          courses: {
            courseId: '123',
            name: 'course 1',
            contentType: 'course',
            pkgVersion: 1,
            batches: [{
              batch: 'batch 1',
              name: '123',
            }]
          }
    };
    spyOn(component['certService'], 'reIssueCertificate').and.returnValue(of ({}));
    spyOn(component, 'toggleModal');
    spyOn(component['toasterService'], 'success');
    component.reIssueCert(batch);
    component['certService'].reIssueCertificate({request: {courseId: '123',
    batchId: '1', userIds: ['testUser'], createdBy: '123'}}).subscribe(data => {
      expect(component.toggleModal).toHaveBeenCalledWith(false);
      expect(component['toasterService'].success).toHaveBeenCalledWith(resourceBundle.messages.dashboard.smsg.m001);
    });
    expect(component['certService'].reIssueCertificate).toHaveBeenCalledWith(
    {request: {courseId: '123', batchId: '1', userIds: ['testUser'], createdBy: '123'}});
  });


  it('reIssue certificate should throw error', () => {
    const batch = {batchId: '1', name: 'batch 1', certificates: [], createdBy: '123' };
    component.userData = {
          userId: 'testUser',
          userName: 'user',
          district: 'district 1',
          courses: {
            courseId: '123',
            name: 'course 1',
            contentType: 'course',
            pkgVersion: 1,
            batches: [{
              batch: 'batch 1',
              name: '123',
            }]
          }
    };
    spyOn(component['certService'], 'reIssueCertificate').and.returnValue(throwError ({}));
    spyOn(component['toasterService'], 'error');
    spyOn(component, 'toggleModal');
    component.reIssueCert(batch);
    component['certService'].reIssueCertificate({request:
      {courseId: '123', batchId: '1', userIds: ['testUser'], createdBy: '123'}}).subscribe(data => {},
      (err) => {
        expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.dashboard.emsg.m003);
        expect(component.toggleModal).toHaveBeenCalledWith(false);
    });
    expect(component['certService'].reIssueCertificate).toHaveBeenCalledWith(
    {request: {courseId: '123', batchId: '1', userIds: ['testUser'], createdBy: '123'}});
  });

  it('should assign showModal TRUE', () => {
    component.toggleModal(true);
    expect(component.showModal).toBeTruthy();
    expect(component.userBatch).toBeUndefined();
  });

  it('should assign showModal FALSE ', () => {
    component['userService'].setUserId('user1');
    component.toggleModal(false, {
      batch: 'batch 1',
      name: '123',
      createdBy: 'user1'
    });
    expect(component.showModal).toBeFalsy();
    expect(component.userBatch).toEqual({
      batch: 'batch 1',
      name: '123',
      createdBy: 'user1'
    });
  });

  it('should check who is created and assign showmodal value', () => {
    component['userService'].setUserId('user1');
    spyOn(component['toasterService'], 'error');
    component.toggleModal(true, {
      batch: 'batch 1',
      name: '123',
      createdBy: 'user2'
    });
    expect(component.showModal).toBeFalsy();
    expect(component.userBatch).toEqual({
      batch: 'batch 1',
      name: '123',
      createdBy: 'user2'
    });
    expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.dashboard.emsg.m004);
  });

  it('should assign telemetryImpression', () => {
    spyOn(component['navigationhelperService'], 'getPageLoadTime').and.returnValue(5);
    spyOn(component, 'setObject').and.returnValue({
      id: '123',
      type: 'course',
      ver: '1.0',
  });

    const impressionData = {
      context: {
        env: 'dashboard',
      },
      edata: {
        type: 'view',
        pageid: 'certificates',
        uri: 'dashboard/certificates',
        duration: 5
      },
      object: {
        id: '123',
        type: 'course',
        ver: '1.0',
    }
    };

    component.setImpressionEvent();
    expect(component.telemetryImpression).toEqual(impressionData);
    expect(component.setObject).toHaveBeenCalled();
  });

  it('should call interact service', () => {
    spyOn(component['telemetryService'], 'interact');
    spyOn(component, 'setObject').and.returnValue({
      id: '123',
      type: 'course',
      ver: '1.0',
  });
    const interactData = {
      context: {
        env: 'dashboard',
        cdata: [
          {id: 'testUser', type: 'userId'},
        ]
      },
      edata: {
        id: 're-issue-cert',
        type: 'click',
        pageid: 'certificates',
        extra: {
          userId: 'testUser',
        }
      },
      object: {
        id: '123',
        type: 'course',
        ver: '1.0',
      }
    };

    component.addTelemetry('re-issue-cert', { userId: 'testUser'});
    expect(component['telemetryService'].interact).toHaveBeenCalledWith(interactData);
    expect(component.setObject).toHaveBeenCalled();
  });

  it('should return object with version 2', () => {
    component.courseId = '123';
    component.userData = {userId: '123', userName: 'user', district: 'district',
    courses: { courseId: '123', name: 'course 1',
    contentType: 'TextBook', pkgVersion: 2.0, batches: [{}]}};
    const data = component.setObject();
    expect(data).toEqual({
      id: '123',
      type: 'TextBook',
      ver: '2',
    });
  });

  it('should return object with version 1', () => {
    component.courseId = '123';
    const data = component.setObject();
    expect(data).toEqual({
      id: '123',
      type: 'course',
      ver: '1',
    });
  });


  it ('should convert to lowercase and return data', () => {
   const data = component.toLowerCase('UserDIstrict');
   expect(data).toEqual('Userdistrict');
  });

  it ('should convert to lowercase and return empty msg', () => {
    const data = component.toLowerCase(undefined);
    expect(data).toEqual('');
   });

   it ('should not call toaster message ', () => {
    spyOn(component['toasterService'], 'error');
    const value = component.isErrorOccurred({
      userId: 'testUser',
      userName: 'user',
      district: 'district 1',
      courses: {
        courseId: '123',
        name: 'course 1',
        contentType: 'course',
        pkgVersion: 1,
        batches: [{
          batch: 'batch 1',
          name: '123',
        }]
      }
    });
    expect(value).toBeFalsy();
    expect(component['toasterService'].error).not.toHaveBeenCalled();
   });

   it ('should  call toaster message for user is not enrolled in batches ', () => {
    spyOn(component['toasterService'], 'error');
    const value = component.isErrorOccurred({
      userId: 'testUser',
      userName: 'user',
      district: 'district 1',
      courses: {
        courseId: '123',
        name: 'course 1',
        contentType: 'course',
        pkgVersion: 1,
        batches: []
      }
    });
    expect(value).toBeTruthy();
    expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.dashboard.emsg.m002);
   });

   it ('should  call toaster message for invalid user ', () => {
    spyOn(component['toasterService'], 'error');
    const value = component.isErrorOccurred({});
    expect(value).toBeTruthy();
    expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m004);
   });

  it('should unsubscribe all subscribed events', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });

  it ('should enable "Re-Issue" button when status = 2 "', () => {
    const batch = {batchId: '1', name: 'batch 1', certificates: [], ssuedCertificates: [], createdBy: '123', status: 2 };
    const enableData = component.enableReIssueCert(batch);
    expect(enableData).toBeTruthy();
  });

  it ('should enable "Re-Issue" button when status != 2 " AND certificates.length >0 (PDF)', () => {
    const batch = {batchId: '1', name: 'batch 1', certificates: [{id: '12'}], issuedCertificates: [], createdBy: '123', status: 1 };
    const enableData = component.enableReIssueCert(batch);
    expect(enableData).toBeTruthy();
  });

  it ('should enable "Re-Issue" button when status != 2 " AND issuedCertificates.length >0 (SVG)', () => {
    const batch = {batchId: '1', name: 'batch 1', certificates: [], issuedCertificates: [{id: '12'}], createdBy: '123', status: 1 };
    const enableData = component.enableReIssueCert(batch);
    expect(enableData).toBeTruthy();
  });

  it ('should enable "Re-Issue" button when status != 2 " AND certificates.length>0 AND issuedCertificates.length>0(PDF and SVG)', () => {
    const batch = {batchId: '1', name: 'batch 1', certificates: [{id: '12'}],
    issuedCertificates: [{id: '12'}], createdBy: '123', status: 1 };
    const enableData = component.enableReIssueCert(batch);
    expect(enableData).toBeTruthy();
  });

  it ('should disable "Re-Issue" button when status != 2" AND certificates.length=0 AND issuedCertificates.length=0', () => {
    const batch = {batchId: '1', name: 'batch 1', certificates: [], issuedCertificates: [], createdBy: '123', status: 1 };
    const enableData = component.enableReIssueCert(batch);
    expect(enableData).toBeFalsy();
  });

});
