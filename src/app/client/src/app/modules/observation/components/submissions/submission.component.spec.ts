import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmissionsComponent } from './submission.component';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {ResourceService,SharedModule } from '@sunbird/shared';
import { Evidence, Submission } from './submissions.component.mock';

describe('SubmissionsComponent', () => {
    let component: SubmissionsComponent;
    let fixture: ComponentFixture<SubmissionsComponent>;
    const resourceBundle = {
        frmelmnts: {
            lbl: {
                edit: 'Edit',
                delete: 'Delete'
            },
        }
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SuiModule,SharedModule.forRoot()],
            declarations: [SubmissionsComponent],
            schemas: [NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA],
            providers: [{ provide: ResourceService, useValue: resourceBundle }]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SubmissionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        component.ngOnInit();
        expect(component).toBeTruthy();
    });
    it('Should emit submission open event', () => {
        const subNum = 1;
        component.open(subNum, Evidence);
        const param = { action: 'edit', data: Submission };
        spyOn( component.selectedSubmission, 'emit').and.returnValue(param);
    });

    it('Should define actions on subimission', () => {
        const type = 'edit';
        const param = { action: type, data: Submission };
        spyOn(component, 'actionEvent').and.callThrough();
        component.submission ={_id:'60c70f07944a3a53d9256010'}
        component.actionEvent(Submission, type);
        spyOn( component.onAction, 'emit').and.returnValue(param);
        expect(component.actionEvent).toHaveBeenCalled();
    });
});
