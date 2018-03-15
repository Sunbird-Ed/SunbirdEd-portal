
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfigService, ToasterService, ResourceService } from '@sunbird/shared';
import { UserService, LearnerService, CoursesService, PermissionService } from '@sunbird/core';
import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule],
      declarations: [
        AppComponent
      ],
      providers: [ToasterService, UserService, ConfigService, LearnerService, PermissionService , ResourceService, CoursesService ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
