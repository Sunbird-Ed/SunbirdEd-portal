import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { ConfirmationPopupComponent } from './confirmation-popup.component';
import { ResourceService } from '@sunbird/shared';


describe('ConfirmationPopupComponent', () => {
  let component: ConfirmationPopupComponent;
  let fixture: ComponentFixture<ConfirmationPopupComponent>;

  const resourceBundle = {
    frmelmnts: {
      btn: {
        close: 'Close'
      },
      cert: {
        lbl: {
          batchCreateSuccess: 'Batch created successfully.',
          batchUpdateSuccess: 'Batch updated successfully.',
          addCert: 'Add certificate'
        }
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      declarations: [ ConfirmationPopupComponent ],
      imports: [SuiModule],
      providers: [
        {provide: ResourceService, useValue: resourceBundle}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationPopupComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });

  it('Should close the modal ', () => {
    component.confirmationModal = {
      deny: jasmine.createSpy('deny')
    };
    component.closeModal();
    expect(component.confirmationModal.deny).toHaveBeenCalled();
  });

  it('should call "closeModal()" on click of "close" button on the popup', () => {
    spyOn(component, 'closeModal').and.stub();
    const buttonElement = fixture.nativeElement.querySelector('#close-modal-btn');
    buttonElement.click();
    expect(component.closeModal).toHaveBeenCalled();
  });

  xit('Should emit an empty event on close of the modal ', () => {
    spyOn(component.close, 'emit');
    component.closeModal();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('Should handle the "window.popstate" event', () => {
    spyOn(component, 'onPopState');
    const popStateEvent = new Event('popstate');
    window.dispatchEvent(popStateEvent);
    expect(component.onPopState).toHaveBeenCalledWith(popStateEvent);
  });

  it('Should close the modal on dispatching "window:popstate" event ', () => {
    spyOn(component, 'closeModal').and.stub();
    component.confirmationModal = {
      deny: jasmine.createSpy('deny')
    };
    component.onPopState(new Event('popstate'));
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should call "navigateToAddCertificate" on click of "Add certificate" button on the popup', () => {
    spyOn(component, 'navigateToAddCertificate').and.stub();
    const buttonElement = fixture.nativeElement.querySelector('#add-certificate');
    buttonElement.click();
    expect(component.navigateToAddCertificate).toHaveBeenCalled();
  });

  it('should close the modal on click of "Add certificate" button', () => {
    component.confirmationModal = {
      deny: jasmine.createSpy('deny')
    };
    component.navigateToAddCertificate();
    expect(component.confirmationModal.deny).toHaveBeenCalled();
  });

  it('should emit an event on click of "Add certificate" button', () => {
    component.batchId = 'SOME_BATCH_ID';
    spyOn(component.close, 'emit');
    const mockObj = {mode: 'add-certificates', batchId: component.batchId};
    component.navigateToAddCertificate();
    expect(component.close.emit).toHaveBeenCalledWith(mockObj);
  });
});
