import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EntityListComponent } from './entity-list.component';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Entity } from './entity-list.component.mock';
describe('EntityListComponent', () => {
    let component: EntityListComponent;
    let fixture: ComponentFixture<EntityListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [SuiModule],
            declarations: [EntityListComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: []
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EntityListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('Should emit the action on entity', () => {
        const type = 'change';
        spyOn(component, 'action').and.callThrough();
        spyOn(component.onAction, 'emit').and.callThrough();
        component.action(Entity, type);
        component.onAction.emit({ action: type, data: Entity });
        expect(component.action).toHaveBeenCalled();
    });
});
