import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CacheService } from 'ng2-cache-service';
import { AppLoaderComponent } from './app-loader.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedModule, ResourceService, ConfigService, BrowserCacheTtlService, LayoutService} from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
import {of} from 'rxjs';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';


describe('AppLoaderComponent', () => {
  let component: AppLoaderComponent;
  let fixture: ComponentFixture<AppLoaderComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,TranslateModule.forRoot({
         loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
         }
      }),],
      declarations: [ AppLoaderComponent ],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService, LayoutService]
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


  it('should call init layout on component intilization', () => {
    spyOn(component, 'initLayout');
    component.ngOnInit();
    expect(component.initLayout).toHaveBeenCalled();
  });

  it('should init layout with new configuration', () => {
    spyOn(localStorage, 'getItem').and.returnValue('joy');
    component.ngOnInit();
    expect(component.layoutConfiguration).toEqual({
      'source': '',
      'name': 'newLayout',
      'options': ''
    });
  });

});
