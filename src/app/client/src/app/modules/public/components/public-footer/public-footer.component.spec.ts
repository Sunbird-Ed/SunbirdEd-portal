import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ConfigService  } from '@sunbird/shared';
import { HttpClientModule } from '@angular/common/http';
import { PublicFooterComponent } from './public-footer.component';

describe('PublicFooterComponent', () => {
  let component: PublicFooterComponent;
  let fixture: ComponentFixture<PublicFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicFooterComponent ],
      providers: [ResourceService, ConfigService],
      imports: [HttpClientModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
