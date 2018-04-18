import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { ProfileService, ProfileVisibilityComponent } from '@sunbird/profile';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { SuiModule } from 'ng2-semantic-ui';
describe('ProfileVisibilityComponent', () => {
  let component: ProfileVisibilityComponent;
  let fixture: ComponentFixture<ProfileVisibilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, Ng2IziToastModule, SuiModule, SharedModule, CoreModule],
      declarations: [ ProfileVisibilityComponent ],
      providers: [ ProfileService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileVisibilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
