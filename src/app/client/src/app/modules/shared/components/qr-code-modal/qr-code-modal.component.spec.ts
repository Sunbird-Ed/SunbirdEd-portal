import { SuiModule } from 'ng2-semantic-ui';
import { throwError as observableThrowError, of as observableOf, Observable } from 'rxjs';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ResourceService, ConfigService, SharedModule } from '@sunbird/shared';
import { HttpClientModule } from '@angular/common/http';
import { QrCodeModalComponent } from './qr-code-modal.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { configureTestSuite } from '@sunbird/test-util';

describe('QrCodeModalComponent', () => {
  let component: QrCodeModalComponent;
  let fixture: ComponentFixture<QrCodeModalComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    snapshot: {
      data: {
        telemetry: {
          env: 'public', pageid: 'explore',
        }
      }
    }
  };
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, RouterTestingModule, HttpClientModule, TelemetryModule.forRoot(), SharedModule.forRoot()],
      providers: [ConfigService, { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QrCodeModalComponent);
    component = fixture.componentInstance;
    const resourceService: any = TestBed.get(ResourceService);
    resourceService._instance = 'sunbird';
  });



  xit('should call onSubmit method and naviagte to search results page', inject([Router],
    (route) => {
      const dialcode = '51u4e';
      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(component, 'setsubmitDialCodeInteractEdata').and.callThrough();
      component.onSubmit(dialcode);
      const submitDialCodeInteractEdata = component.setsubmitDialCodeInteractEdata(dialcode);
      expect(component.submitDialCodeInteractEdata).toEqual(submitDialCodeInteractEdata);
      expect(component.router.navigate).toHaveBeenCalledWith(['/get/dial/', dialcode]);
    }));
  it('should call onSubmit method when dialcodevalue is null ', inject([Router],
    (route) => {
      const dialcode = '';
      spyOn(component, 'onSubmit').and.callThrough();
      spyOn(component, 'setsubmitDialCodeInteractEdata').and.callThrough();
      component.onSubmit(dialcode);
      const submitDialCodeInteractEdata = component.setsubmitDialCodeInteractEdata(dialcode);
      expect(component.submitDialCodeInteractEdata).toEqual(submitDialCodeInteractEdata);
    }));
  it('should initialize the component expected calls for setInteractEventData  ', () => {
    spyOn(component, 'setInteractEventData').and.callThrough();
    component.ngOnInit();
    expect(component.setInteractEventData).toHaveBeenCalled();
    const mockSetInteractEventData = {
      id: 'close-dial-code',
      type: 'click',
      pageid: 'explore',
    };
    expect(component.closeDialCodeInteractEdata).toEqual(mockSetInteractEventData);
  });
  it('should call closeModal method and emit the event  ', () => {
    const modal = fixture.debugElement.nativeElement.querySelector('i');
    spyOn(component, 'closeModal').and.callThrough();
    spyOn(component.closeQrModal, 'emit');
    modal.dispatchEvent(new Event('click'));
    component.closeModal();
    expect(component.closeQrModal.emit).toHaveBeenCalledWith('success');
  });
});
