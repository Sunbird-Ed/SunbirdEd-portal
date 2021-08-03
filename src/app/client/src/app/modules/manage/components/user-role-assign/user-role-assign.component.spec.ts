import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserRoleAssignComponent } from './user-role-assign.component';
import { configureTestSuite } from '@sunbird/test-util';
describe('UserRoleAssignComponent', () => {
  configureTestSuite();
  let component: UserRoleAssignComponent;
  let fixture: ComponentFixture<UserRoleAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRoleAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
