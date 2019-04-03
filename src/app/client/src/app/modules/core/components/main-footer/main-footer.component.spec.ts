import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ResourceService } from '@sunbird/shared';
import { MainFooterComponent } from './main-footer.component';
import { CacheService } from 'ng2-cache-service';
describe('MainFooterComponent', () => {
  let component: MainFooterComponent;
  let fixture: ComponentFixture<MainFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainFooterComponent ],
      providers: [CacheService, ResourceService],
      imports: [HttpClientModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
