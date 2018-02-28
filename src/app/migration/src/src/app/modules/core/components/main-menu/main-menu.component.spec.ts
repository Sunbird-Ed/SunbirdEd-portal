import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ConfigService } from '@sunbird/shared';
import { MainMenuComponent } from './main-menu.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
describe('MainMenuComponent', () => {
  let component: MainMenuComponent;
  let fixture: ComponentFixture<MainMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [ MainMenuComponent ],
      providers: [ HttpClient, ResourceService, ConfigService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
