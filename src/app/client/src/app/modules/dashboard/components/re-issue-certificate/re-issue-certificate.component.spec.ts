import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SuiModalModule } from 'ng2-semantic-ui';
import { TelemetryModule, TelemetryService } from '@sunbird/telemetry';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReIssueCertificateComponent } from './re-issue-certificate.component';
import { configureTestSuite } from '@sunbird/test-util';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('ReIssueCertificateComponent', () => {
  let component: ReIssueCertificateComponent;
  let fixture: ComponentFixture<ReIssueCertificateComponent>;
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
          m003: 'Could not reissue certificate. Try again later'
        },
        smsg: {
          m001: 'Certificate Re-Issued successfully'
        }
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
      imports: [SharedModule.forRoot(), HttpClientTestingModule, TelemetryModule, SuiModalModule, ReactiveFormsModule, FormsModule],
      providers: [TelemetryService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: Router, useClass: RouterStub },
        { provide: ResourceService, useValue: resourceBundle }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReIssueCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    spyOn(component['certService'], 'getUserCertList').and.returnValue(of({ result: { response: { err: { message: 'Error while fetching cert list' } } } }));
    spyOn(component, 'showErrorMsg');
    component.getCertList();
    component['certService'].getUserCertList('testUser', '123').subscribe(data => {
      expect(component.userName).toEqual('');
      expect(component.disableBtn).toBeFalsy();
      expect(component.showErrorMsg).toHaveBeenCalled();
    });
    expect(component['certService'].getUserCertList).toHaveBeenCalledWith('testUser', '123');
  });

  it('should throw  error while fetching certList', () => {
    component.userName = 'testUser';
    spyOn(component['certService'], 'getUserCertList').and.returnValue(throwError({ result: { response: { err: { message: 'Error while fetching cert list' } } } }));
    spyOn(component, 'showErrorMsg');
    component.getCertList();
    component['certService'].getUserCertList('testUser', '123').subscribe(data => {
    }, err => {
      expect(component.showErrorMsg).toHaveBeenCalled();
    });
    expect(component['certService'].getUserCertList).toHaveBeenCalledWith('testUser', '123');
    expect(component.userName).toEqual('');
    expect(component.disableBtn).toBeFalsy();
  });

  it('should return  certList with batchList[] empty', () => {
    const response = {
      result: {
        response: {
          userId: 'testUser',
          userName: 'user',
          district: 'district 1',
          courses: {
            courseId: '123',
            name: 'course 1',
            batches: []
          }
        }
      }
    };
    component.userName = 'testUser';
    spyOn(component['certService'], 'getUserCertList').and.returnValue(of(response));
    spyOn(component['toasterService'], 'error');
    component.getCertList();
    component['certService'].getUserCertList('testUser', '123').subscribe(data => {
      expect(component.userData).toEqual(response.result.response);
      expect(component.batchList).toEqual([]);
      expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.dashboard.emsg.m002);
    });
    expect(component['certService'].getUserCertList).toHaveBeenCalledWith('testUser', '123');
    expect(component.userName).toEqual('');
    expect(component.disableBtn).toBeFalsy();
  });

  it('should return  certList with batchList[{}]', () => {
    const response = {
      result: {
        response: {
          userId: 'testUser',
          userName: 'user',
          district: 'district 1',
          courses: {
            courseId: '123',
            name: 'course 1',
            batches: [{
              batchId: '1',
            }]
          }
        }
      }
    };
    component.userName = 'testUser';
    spyOn(component['certService'], 'getUserCertList').and.returnValue(of(response));
    component.getCertList();
    component['certService'].getUserCertList('testUser', '123').subscribe(data => {
      expect(component.userData).toEqual(response.result.response);
      expect(component.batchList).toEqual([{batchId: '1'}]);
    });
    expect(component['certService'].getUserCertList).toHaveBeenCalledWith('testUser', '123');
    expect(component.userName).toEqual('');
    expect(component.disableBtn).toBeFalsy();
  });

  it ('should reIssue certificate', () => {
    const batch = {batchId: '1', name: 'batch 1', certificates: [] };
    component.userData = {
          userId: 'testUser',
          userName: 'user',
          district: 'district 1',
          courses: {
            courseId: '123',
            name: 'course 1',
            batches: [{
              batch: 'batch 1',
              name: '123',
            }]
          }
    };
    spyOn(component['certService'], 'reIssueCertificate').and.returnValue(of ({}));
    spyOn(component['toasterService'], 'success');
    spyOn(component, 'toggleModal');
    component.reIssueCert(batch);
    component['certService'].reIssueCertificate({request: {courseId: '123', batchId: '1', userIds: ['testUser']}}).subscribe(data => {
      expect(component['toasterService'].success).toHaveBeenCalledWith(resourceBundle.messages.dashboard.smsg.m001);
      expect(component.toggleModal).toHaveBeenCalledWith(false);
    });
    expect(component['certService'].reIssueCertificate).toHaveBeenCalledWith(
    {request: {courseId: '123', batchId: '1', userIds: ['testUser']}});
  });


  it ('reIssue certificate should throw error', () => {
    const batch = {batchId: '1', name: 'batch 1', certificates: [] };
    component.userData = {
          userId: 'testUser',
          userName: 'user',
          district: 'district 1',
          courses: {
            courseId: '123',
            name: 'course 1',
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
    component['certService'].reIssueCertificate({request: {courseId: '123', batchId: '1', userIds: ['testUser']}}).subscribe(data => {},
      (err) => {
        expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.dashboard.emsg.m003);
        expect(component.toggleModal).toHaveBeenCalledWith(false);
    });
    expect(component['certService'].reIssueCertificate).toHaveBeenCalledWith(
    {request: {courseId: '123', batchId: '1', userIds: ['testUser']}});
  });


  it('should assign showModal TRUE', () => {
    component.toggleModal(true);
    expect(component.showModal).toBeTruthy();
    expect(component.userBatch).toBeUndefined();
  });

  it('should assign showModal TRUE', () => {
    component.toggleModal(false, {
      batch: 'batch 1',
      name: '123',
    });
    expect(component.showModal).toBeFalsy();
    expect(component.userBatch).toEqual({
      batch: 'batch 1',
      name: '123',
    });
  });

  it ('should assign telemetryImpression', () => {
    spyOn(component['navigationhelperService'], 'getPageLoadTime').and.returnValue(5);

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
  });

  it ('should call interact service', () => {
    spyOn(component['telemetryService'], 'interact');

    const interactData = {
      context: {
        env: 'dashboard',
        cdata: []
      },
      edata: {
        id: 're-issue-cert',
        type: 'click',
        pageid: 'certificates',
        extra: {
          userName: 'testUser'
        }
      },
      object: {
        id: '123',
        type: 'course',
        ver: '1.0',
      }
    };

    component.addTelemetry('re-issue-cert', { userName: 'testUser'});
    expect(component['telemetryService'].interact).toHaveBeenCalledWith(interactData);
  });

  it('should call toaster service with error msg', () => {
    spyOn(component['toasterService'], 'error');
    component.showErrorMsg();
    expect(component['toasterService'].error).toHaveBeenCalledWith(resourceBundle.messages.dashboard.emsg.m001);
  });

  it('should unsubscribe all subscribed events', () => {
    spyOn(component.unsubscribe$, 'next');
    spyOn(component.unsubscribe$, 'complete');
    component.ngOnDestroy();
    expect(component.unsubscribe$.next).toHaveBeenCalled();
    expect(component.unsubscribe$.complete).toHaveBeenCalled();
  });
});
