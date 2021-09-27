import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AlertModalComponent } from './alert-modal.component';
import {
  SuiModal,
  ComponentModalConfig,
  ModalSize,
  SuiModalModule,
} from 'ng2-semantic-ui-v9';
import { Location } from '@angular/common';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {metaData} from './alert-modal.component.spec.data';

interface IAlertModalContext {
  data: any;
}

describe('AlertModalComponent', () => {
  let component: AlertModalComponent;
  let fixture: ComponentFixture<AlertModalComponent>;
  let alertModal;

  const modalContext: IAlertModalContext = {
    data: metaData,
  };
  const fakeModalService = {
    approve: () => {},
    deny: () => {},
    context: modalContext,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule.forRoot(),
        SuiModalModule,
        FormsModule,
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
        ResourceService,
        { provide: SuiModal, useValue: fakeModalService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getMethod type accept', () => {
    spyOn(component, 'getMethod').and.callThrough();
    component.getMethod(metaData.footer.buttons[1]);
    expect(component.getMethod).toHaveBeenCalled();
  });

  it('should call getMethod type cancel', () => {
    spyOn(component, 'getMethod').and.callThrough();
    component.getMethod(metaData.footer.buttons[0]);
    expect(component.getMethod).toHaveBeenCalled();
  });

  it('should call navigatePrevious type cancel', () => {
    spyOn(component, 'navigatePrevious').and.callThrough();
    component.navigatePrevious(metaData);
    expect(component.navigatePrevious).toHaveBeenCalled();
  });

  // it('popstate elements', () => {
  //   spyOn(component,"onPopState").and.callThrough();
  //   const event = new PopStateEvent('popstate');
  //   component.onPopState(event);
  //   expect(component.onPopState).toHaveBeenCalledWith(event);
  // });


});





