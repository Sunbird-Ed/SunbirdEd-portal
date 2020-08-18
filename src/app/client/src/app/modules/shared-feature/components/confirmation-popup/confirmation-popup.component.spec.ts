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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
