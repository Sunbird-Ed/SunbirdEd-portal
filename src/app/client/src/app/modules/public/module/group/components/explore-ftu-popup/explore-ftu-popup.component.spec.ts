import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { ExploreFtuPopupComponent } from './explore-ftu-popup.component';

describe('ExploreFtuPopupComponent', () => {
  let component: ExploreFtuPopupComponent;
  let fixture: ComponentFixture<ExploreFtuPopupComponent>;
  const resourceBundle = {
    frmelmnts: {
      lbl: {
        groupWelcomeTitle: 'Welcome to groups',
      },
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExploreFtuPopupComponent ],
      imports: [HttpClientModule, SharedModule.forRoot()],
      providers: [ { provide: ResourceService, useValue: resourceBundle }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExploreFtuPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
