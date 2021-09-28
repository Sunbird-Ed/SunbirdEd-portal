import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CertPreviewPopupComponent } from './cert-preview-popup.component';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { ResourceService } from '@sunbird/shared';
import { By } from '@angular/platform-browser';

describe('CertPreviewPopupComponent', () => {
  let component: CertPreviewPopupComponent;
  let fixture: ComponentFixture<CertPreviewPopupComponent>;

  const resourceBundle = {
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule],
      declarations: [ CertPreviewPopupComponent ],
      providers: [
        {provide: ResourceService, useValue: resourceBundle}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CertPreviewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.modal).toBeTruthy();
  });

  it('Should close the modal by triggering emit event without name "" ', () => {
    spyOn(component.close, 'emit');
    component.closeModal();
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('Should close the modal by triggering emit event with name & template ', () => {
    spyOn(component.close, 'emit');
    const mockObj = jasmine.createSpyObj({name: 'select', template:  {value: 'cert.svg'}});
    component.template = mockObj.template;
    component.closeModal(mockObj.name);
    expect(component.close.emit).toHaveBeenCalledWith(mockObj);
  });

  it('Should handle the "window.popstate" event', () => {
    spyOn(component, 'onPopState');
    const popStateEvent = new Event('popstate');
    window.dispatchEvent(popStateEvent);
    expect(component.onPopState).toHaveBeenCalledWith(popStateEvent);
  });

  it('Should close the modal on dispatching "window:popstate" event ', () => {
    component.modal = {
      deny: jasmine.createSpy('deny')
    };
    component.onPopState(new Event('popstate'));
    expect(component.modal.deny).toHaveBeenCalled();
  });

  it('Should close the modal if exist ', () => {
    // var modal = jasmine.createSpy('modal.deny() spy').and.callFake(() => { return true});
    // let modalElement = fixture.debugElement.query(By.css("sui-modal"));
    // let modal = modalElement.componentInstance;
    // component.modal = modal;
    // var certTemp = {value: "cert.svg"};
    // component.template = certTemp;
    component.modal = {
      deny: jasmine.createSpy('deny')
    };
    component.closeModal();

    expect(component.modal.deny).toHaveBeenCalled();
  });
});
