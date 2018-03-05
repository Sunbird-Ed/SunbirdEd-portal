import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MainHeaderComponent } from './main-header.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ConfigService, ResourceService } from '@sunbird/shared';
import { UserService, LearnerService , PermissionService} from '@sunbird/core';
describe('MainHeaderComponent', () => {
  let component: MainHeaderComponent;
  let fixture: ComponentFixture<MainHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ MainHeaderComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ ResourceService, PermissionService, UserService, ConfigService, LearnerService, HttpClient ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
