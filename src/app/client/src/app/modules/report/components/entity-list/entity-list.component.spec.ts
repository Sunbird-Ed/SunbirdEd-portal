import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityListComponent } from './entity-list.component';
import {
  ConfigService,
  ResourceService,
  SharedModule,
  ILoaderMessage,
  INoResultMessage
} from '@sunbird/shared';
import {CoreModule} from '@sunbird/core';
import { SuiModalModule } from 'ng2-semantic-ui-v9';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {
  ObservationData
} from '../solution-listing/solution-listing.component.spec.data';

describe('EntityListComponent', () => {
  let component: EntityListComponent;
  let fixture: ComponentFixture<EntityListComponent>;
  let element;

  const resourceBundle = {
    frmelmnts: {
      lbl: {
        selectEntity: 'Select Entity'
      },
      btn: {
        submit: 'Submit'
      }
    }
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModalModule, SharedModule, CoreModule, InfiniteScrollModule],
      declarations: [ EntityListComponent ],
      providers: [{ provide: ResourceService, useValue: resourceBundle }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntityListComponent);
    component = fixture.componentInstance;
    component.solution = ObservationData.result.data[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call closeModal', () => {
    spyOn(component, 'closeModal').and.callThrough();
    component.modal = {
      approve: () => {}
    };
    component.closeModal();
    expect(component.closeModal).toHaveBeenCalled();
  });

  it('should call onEntityChange new entity',()=>{
    spyOn(component,'onEntityChange').and.callThrough();
    component.onEntityChange(ObservationData.result.data[0].entities[0]);
    expect(component.onEntityChange).toHaveBeenCalled();
  });

  it('should call onEntityChange same entity',()=>{
    component.solution={
      entities:[
      ObservationData.result.data[1].entities[0]
      ]
    };
    spyOn(component,'onEntityChange').and.callThrough();
    component.onEntityChange(ObservationData.result.data[0].entities[0]);
    expect(component.onEntityChange).toHaveBeenCalled();
  });

  it('should call submit',()=>{
    spyOn(component,'submit').and.callThrough();
    component.modal = {
      approve: () => {}
    };
    component.submit();
    expect(component.submit).toHaveBeenCalled();
  });
});
