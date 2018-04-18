import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@sunbird/core';
import { ProfileService, ProfilePageComponent } from '@sunbird/profile';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule} from '@sunbird/shared';

describe('ProfilePageComponent', () => {
  let component: ProfilePageComponent;
  let fixture: ComponentFixture<ProfilePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, SharedModule, CoreModule],
      declarations: [ ProfilePageComponent ],
      providers: [ProfileService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
