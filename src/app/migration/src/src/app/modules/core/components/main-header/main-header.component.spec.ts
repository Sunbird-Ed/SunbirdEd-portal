import { Ng2IzitoastService } from 'ng2-izitoast';
import { Observable } from 'rxjs/Observable';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MainHeaderComponent } from './main-header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfigService, ResourceService, ToasterService } from '@sunbird/shared';
import { UserService, LearnerService , PermissionService} from '@sunbird/core';
import * as mockData from '@sunbird/core';
import { Ng2IziToastModule } from 'ng2-izitoast';
const mockUserData = mockData.mockRes;
describe('MainHeaderComponent', () => {
  let component: MainHeaderComponent;
  let fixture: ComponentFixture<MainHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, Ng2IziToastModule],
      declarations: [ MainHeaderComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ ToasterService, ResourceService, PermissionService, UserService, ConfigService, LearnerService, HttpClient ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('should subscribe to user service', () => {
  //   const userService = TestBed.get(UserService);
  //   spyOn(userService, 'userData$').and.returnValue(Observable.of({err: null, userProfile: {a: 1, b: 2}}));
  //   fixture.detectChanges();
  //   expect(component.userProfile).toBeTruthy();
  // });

  it('should subscribe to user service', () => {
    const userService = TestBed.get(UserService);
    const learnerService = TestBed.get(LearnerService);
    spyOn(learnerService, 'get').and.returnValue(Observable.of(mockUserData));
    userService.initialize();
    fixture.detectChanges();
    console.log(component);
    expect(component.userProfile).toBeTruthy();
  });
});
