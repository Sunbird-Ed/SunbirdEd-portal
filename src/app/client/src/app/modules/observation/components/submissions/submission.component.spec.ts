import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubmissionsComponent } from './submission.component';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {ResourceService } from '@sunbird/shared';
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
            imports: [SuiModule],
            declarations: [SubmissionsComponent],
            schemas: [NO_ERRORS_SCHEMA],
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
        expect(component).toBeTruthy();
    });
    it('Should emit submission open event', () => {
        spyOn(component, 'open').and.callThrough();
        const subNum = 1;
        component.open(subNum, Evidence);
        expect(component.open).toHaveBeenCalled();
    });

    it('Should define actions on subimission', () => {
        const type = 'edit';
        const param = { action: type, data: Submission };
        spyOn(component, 'actionEvent').and.callThrough();
        component.actionEvent(Submission, type);
        spyOn( component.onAction, 'emit').and.returnValue(param);
        expect(component.actionEvent).toHaveBeenCalled();
    });
});
