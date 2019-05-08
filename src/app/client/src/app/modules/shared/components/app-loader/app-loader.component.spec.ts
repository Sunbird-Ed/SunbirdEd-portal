import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CacheService } from 'ng2-cache-service';
import { AppLoaderComponent } from './app-loader.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';



describe('AppLoaderComponent', () => {
  let component: AppLoaderComponent;
  let fixture: ComponentFixture<AppLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ AppLoaderComponent ],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
