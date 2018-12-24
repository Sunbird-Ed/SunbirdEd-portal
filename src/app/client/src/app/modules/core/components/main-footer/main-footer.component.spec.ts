import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ResourceService, ConfigService , BrowserCacheTtlService } from '@sunbird/shared';
import { HttpClientModule } from '@angular/common/http';
import { PublicFooterComponent } from './public-footer.component';
import { CacheService } from 'ng2-cache-service';
describe('PublicFooterComponent', () => {
  let component: PublicFooterComponent;
  let fixture: ComponentFixture<PublicFooterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicFooterComponent ],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService],
      imports: [HttpClientModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
