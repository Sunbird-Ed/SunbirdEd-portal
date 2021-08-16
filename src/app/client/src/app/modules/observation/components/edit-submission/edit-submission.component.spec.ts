import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditSubmissionComponent } from './edit-submission.component';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { Submission } from './edit-submission.component.mock';
describe('SubmissionsComponent', () => {
    let component: EditSubmissionComponent;
    let fixture: ComponentFixture<EditSubmissionComponent>;
    let editData = {
      title: "test",
      subTitle: "test",
      defaultValue: "test",
      leftBtnText: "test",
      rightBtnText: "test",
      action: "test",
      returnParams: {},
    };
    const resourceBundle = {
        frmelmnts: {
            lbl: {
                instanceName: 'Instance Name'
            },
            btn: {
                update: 'Update',
                cancel: 'Cancel'
            }
        }
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SuiModule],
            declarations: [EditSubmissionComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [{ provide: ResourceService, useValue: resourceBundle }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EditSubmissionComponent);
        component = fixture.componentInstance;
        component.editData = editData
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('Close modal event', () => {
        spyOn(component, 'closeModal').and.callThrough();
        spyOn(component.onAction, 'emit').and.callThrough();
        component.closeModal();
        component.modal.deny();
        component.onAction.emit({ action: 'edit', data: {} });
        expect(component.onAction.emit).toHaveBeenCalled();
        expect(component.closeModal).toHaveBeenCalled();
    });

    it('Submit the submission changes', () => {
        spyOn(component, 'submit').and.callThrough();
        spyOn(component.onAction, 'emit').and.callThrough();
        component.submit();
        component.modal.approve();
        component.onAction.emit({ action: 'edit', data: Submission });
        expect(component.onAction.emit).toHaveBeenCalled();
        expect(component.submit).toHaveBeenCalled();
    });
});
