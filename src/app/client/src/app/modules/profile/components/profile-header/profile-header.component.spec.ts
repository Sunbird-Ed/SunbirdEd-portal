import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule} from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { ProfileService, ProfileHeaderComponent } from '@sunbird/profile';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
describe('ProfileHeaderComponent', () => {
  let component: ProfileHeaderComponent;
  let fixture: ComponentFixture<ProfileHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, CoreModule, SharedModule],
      declarations: [ ProfileHeaderComponent ],
      providers: [ ProfileService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
