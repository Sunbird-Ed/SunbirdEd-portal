import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupsService } from '../../../services';
import { ToasterService, ResourceService } from '@sunbird/shared';
import { SearchService } from '@sunbird/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ActivityDashboardComponent } from './activity-dashboard.component';
import { SuiModule } from 'ng2-semantic-ui';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ActivityDashboardComponent', () => {
  let component: ActivityDashboardComponent;
  let fixture: ComponentFixture<ActivityDashboardComponent>;

  // class RouterStub {
  //   navigate = jasmine.createSpy('navigate');
  // }
  const fakeActivatedRoute = {
    'snapshot': {'params': ({ groupId: '2ae1e555-b9cc-4510-9c1d-2f90e94ded90' }) }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityDashboardComponent ],
      imports: [SharedModule.forRoot(), CoreModule, RouterModule.forRoot([]), SuiModule, CommonConsumptionModule,
                HttpClientModule],
      providers: [
          GroupsService, ToasterService, ResourceService, SearchService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // component.groupId = fakeActivatedRoute.snapshot.params.groupId;
    // component.selectedActivity = component.filterTypes[0].label;
    // spyOn(component, 'getGroupData');
    // component.ngOnInit();
    expect(component).toBeTruthy();
    // expect(component.getGroupData).toHaveBeenCalled();
  });

  // it('should get activities data', () => {
  //    const groupService = TestBed.get(GroupsService);
  //    component.isLoader = true;
  //    spyOn(groupService, 'createUser').and.callThrough();
  //    spyOn(groupService, 'addGroupFields').and.stub();
  //    component.getGroupData();
  //    expect(groupService.createUser).toHaveBeenCalledWith(component.groupId, true, true, true);
  //    expect(groupService.addGroupFields).toHaveBeenCalled();
  //   });

});
