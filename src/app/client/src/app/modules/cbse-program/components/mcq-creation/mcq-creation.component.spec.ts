import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { McqCreationComponent } from './mcq-creation.component';
import { CoreModule, UserService } from '@sunbird/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule } from '@sunbird/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { SuiModule } from 'ng2-semantic-ui';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response } from './mcq-creation.component.spec.data';
import { SanitizeHtmlPipe } from '../../pipe/sanitize-html.pipe';

describe('McqCreationComponent', () => {
  let component: McqCreationComponent;
  let fixture: ComponentFixture<McqCreationComponent>;
  const userServiceStub = {
    userProfile: Response.userData
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [McqCreationComponent, SanitizeHtmlPipe],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [HttpClientTestingModule, CoreModule, TelemetryModule.forRoot(), SharedModule.forRoot(), SuiModule, RouterTestingModule,
      ReactiveFormsModule, FormsModule],
      providers: [
        {provide: UserService , useValue: userServiceStub}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(McqCreationComponent);
    component = fixture.componentInstance;
    component.sessionContext = Response.sessionContext;
    component.role = {
      currentRole: 'CONTRIBUTOR'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
