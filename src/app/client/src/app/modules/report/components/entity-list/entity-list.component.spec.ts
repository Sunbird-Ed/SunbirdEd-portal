import { LocationStrategy } from '@angular/common';
import { Component,EventEmitter,Input,OnInit,Output,ViewChild } from '@angular/core';
import { ResourceService } from '@sunbird/shared';
import { EntityListComponent } from './entity-list.component';

describe('EntityListComponent', () => {
    let component: EntityListComponent;
    let onPopStateCallback: () => void;

    const resourceService :Partial<ResourceService> ={
        getResource: jest.fn(),
    };
	const location :Partial<LocationStrategy> ={
        onPopState: jest.fn((callback: () => void) => {
            onPopStateCallback = callback;
        }) as any,
    };

    beforeAll(() => {
        component = new EntityListComponent(
            resourceService as ResourceService,
			location as LocationStrategy
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should emit closeEvent with null value when closeModal is called', () => {
        component.modal = { deny: jest.fn()};
        jest.spyOn(component.closeEvent,'emit');
        component.closeModal();
    
        expect(component.closeEvent.emit).toHaveBeenCalledWith({ value: null });
    });
    
    describe('onEntityChange',() => {
        it('should select the specified entity and deselect others', () => {
            component.solution = {
                entities: [
                { _id: 1, selected: false },
                { _id: 2, selected: false },
                { _id: 3, selected: false }
                ]
            };
            component.onEntityChange(component.solution.entities[1]);
        
            expect(component.selectedEntity).toEqual(component.solution.entities[1]);
            component.solution.entities.forEach(entity => {
            if (entity !== component.solution.entities[1]) {
                expect(entity.selected).toBe(false);
            }
            });
        });

        it('should set selectedListCount to 1 when an entity is selected', () => {
            component.onEntityChange(component.solution.entities[2]);
            expect(component.selectedListCount).toBe(1);
        });
    });
    
    it('should emit closeEvent with solutionDetail and selectedEntity when submit is called', () => {
        component.selectedEntity = { _id: 2 };
        jest.spyOn(component.closeEvent,'emit');
        component.submit();

        expect(component.closeEvent.emit).toHaveBeenCalledWith({
          value: {
            solutionDetail: component.solution,
            selectedEntity: component.selectedEntity
          }
        });
    });
    
    it('should call modal.deny() when onPopState is triggered and modal exists', () => {
        component.modal = { deny: jest.fn() };
        onPopStateCallback();

        expect(component.modal.deny).toHaveBeenCalled();
    });
});