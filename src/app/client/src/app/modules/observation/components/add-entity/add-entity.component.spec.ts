import { Component,OnInit,ViewChild,Input,EventEmitter,Output } from '@angular/core';
import { ObservationService,KendraService,ObservationUtilService } from '@sunbird/core';
import { ConfigService,ResourceService,ILoaderMessage,INoResultMessage } from '@sunbird/shared';
import { LocationStrategy } from '@angular/common';
import { AddEntityComponent } from './add-entity.component';
import { of } from 'rxjs';

describe('AddEntityComponent', () => {
    let component: AddEntityComponent;

    const mockObservationService :Partial<ObservationService> ={
        post: jest.fn(),
    };
	const mockKendraService :Partial<KendraService> ={};
	const mockResourceService :Partial<ResourceService> ={};
	const mockObservationUtilService :Partial<ObservationUtilService> ={
        getProfileDataList: jest.fn().mockResolvedValue('mockedData'),
    };
	const mockConfig :Partial<ConfigService> ={
        urlConFig:{
            URLS:{
                OBSERVATION:{
                    OBSERVATION_UPDATE_ENTITES: 'mock-observation-update-entities'
                } 
            }
        }
    };
	const mockLocation :Partial<LocationStrategy> ={};

    beforeAll(() => {
        component = new AddEntityComponent(
            mockObservationService as ObservationService,
			mockKendraService as KendraService,
			mockResourceService as ResourceService,
			mockObservationUtilService as ObservationUtilService,
			mockConfig as ConfigService,
			mockLocation as LocationStrategy
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });

    it('should submit selected entities for observation update', () => {
        const mockSelectedEntities = ['mock-entity1', 'mock-entity2'];
        const mockPayload = { data: mockSelectedEntities };
        const mockObservationId = 'mock-observationId';
        component.selectedEntities = mockSelectedEntities;
        component.payload = mockPayload;
        component.observationId = mockObservationId;
        jest.spyOn(component['observationService'] as any,'post').mockReturnValue(of({}));
        jest.spyOn(component,'closeModal');
        component.submit();

        expect(mockObservationService.post).toHaveBeenCalledWith({
          url: component.config.urlConFig.URLS.OBSERVATION.OBSERVATION_UPDATE_ENTITES + mockObservationId,
          param: {},
          data: mockPayload,
        });
        expect(component.payload).toEqual({"data": mockSelectedEntities});
        expect(component.closeModal).toHaveBeenCalled();
    });
    
    it('should set the values on loadmore',() =>{
        component.page = 1;
        component.count = 3;
        component.targetEntity = {_id: 'mock-id'};
        component.entities = ['mock-entity-1','mock-entity-2'];
        jest.spyOn(component['observationService'] as any,'post').mockReturnValue(of({}));
        jest.spyOn(component,'search');
        component.loadMore();
        
       expect(component.page).toEqual(2);
       expect(component.search).toHaveBeenCalled();
    });

    describe('selectEntity',() =>{
        it('should set values and call methods on searchEntity',() =>{
            component.searchEntity();

            expect(component.page).toEqual(1);
            expect(component.entities).toEqual([]);
            expect(component.search).toHaveBeenCalled();
        });
        
        it('should add selected entity to selectedEntities array if it is not already included', () => {
            const event = { _id: '1', isSelected: false };
            component.selectEntity(event);
            expect(component.selectedEntities).toEqual(["mock-entity1","mock-entity2","1"]);
        });
        
        it('should remove selected entity from selectedEntities array if it is already included', () => {
            component.selectedEntities = ['1'];
            const event = { _id: '1', isSelected: true };
            component.selectEntity(event);
            expect(component.selectedEntities).toEqual([]);
        });
        
        it('should increment selectedListCount if event.selected is true', () => {
            const event = { _id: '1', isSelected: false, selected: true };
            component.selectEntity(event);
            expect(component.selectedListCount).toEqual(-1);
        });
        
        it('should decrement selectedListCount if event.selected is false', () => {
            component.selectedListCount = 1;
            const event = { _id: '1', isSelected: true, selected: false };
            component.selectEntity(event);
            expect(component.selectedListCount).toEqual(0);
        });
    });

    it('should set values and call methods on closeModal',() =>{
        component.closeModal();
        expect(component.showDownloadModal).toBeFalsy();
    });

});