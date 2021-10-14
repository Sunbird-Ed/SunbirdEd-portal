import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserRoleAssignComponent } from './user-role-assign.component';
import { configureTestSuite } from '@sunbird/test-util';
import { FormBuilder, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { AvatarModule } from 'ngx-avatar';
import { TelemetryService } from '@sunbird/telemetry';
describe('UserRoleAssignComponent', () => {
  configureTestSuite();
  let component: UserRoleAssignComponent;
  let fixture: ComponentFixture<UserRoleAssignComponent>;

  beforeEach(async(() => {
    
    TestBed.configureTestingModule({
      imports: [ FormsModule, SuiModule, AvatarModule],
      declarations: [ UserRoleAssignComponent ],
      providers: [TelemetryService]
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