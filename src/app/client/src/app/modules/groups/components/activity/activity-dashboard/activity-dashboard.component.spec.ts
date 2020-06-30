import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResourceService, SharedModule } from '@sunbird/shared';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivityDashboardComponent } from './activity-dashboard.component';
describe('ActivityDashboardComponent', () => {
  let component: ActivityDashboardComponent;
  let fixture: ComponentFixture<ActivityDashboardComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityDashboardComponent ],
      imports: [SharedModule.forRoot(), HttpClientTestingModule],
      providers: [ResourceService]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});