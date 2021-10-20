import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserRoleAssignComponent } from './user-role-assign.component';
import { configureTestSuite } from '@sunbird/test-util';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { CoreModule } from '@sunbird/core';
import { AvatarModule } from 'ngx-avatar';
import { TelemetryService } from '@sunbird/telemetry';
import { TranslateModule } from '@ngx-translate/core';
describe('UserRoleAssignComponent', () => {
  configureTestSuite();
  let component: UserRoleAssignComponent;
  let fixture: ComponentFixture<UserRoleAssignComponent>;

  beforeEach(async(() => {
    
    TestBed.configureTestingModule({
      imports: [SuiModule, CoreModule,
        FormsModule, ReactiveFormsModule, HttpClientTestingModule, RouterModule.forRoot([]), TranslateModule.forRoot()],
      declarations: [ UserRoleAssignComponent ],
      providers: [TelemetryService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
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