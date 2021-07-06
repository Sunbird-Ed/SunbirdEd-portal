import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentCreditsComponent } from './content-credits.component';
import { SharedModule, ResourceService, ConfigService, BrowserCacheTtlService, InterpolatePipe } from '@sunbird/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Response } from './content-credits.component.spec.data';
import { CacheService } from 'ng2-cache-service';
import { configureTestSuite } from '@sunbird/test-util';
import { TranslateModule, TranslateLoader, TranslateFakeLoader } from '@ngx-translate/core';

describe('ContentCreditsComponent', () => {
  let component: ContentCreditsComponent;
  let fixture: ComponentFixture<ContentCreditsComponent>;
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule, HttpClientTestingModule, TranslateModule.forRoot({
         loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
         }
      })],
      declarations: [ContentCreditsComponent, InterpolatePipe],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentCreditsComponent);
    component = fixture.componentInstance;
  });
  it('should take content data as  INPUT  ', () => {
    component.contentData = Response.metaData;
    const actualKeys = Object.keys(component.contentData);
    const expectedKeys = 'contentCredits';
    expect(component.showContentCreditModal).toBeDefined();
    expect(component.showContentCreditModal).toBeFalsy();
    expect(component.contentData).toBeDefined();
    expect(actualKeys).toContain(expectedKeys);

  });

  it('should show content credits data', () => {
    component.contentData = Response.metaData;
    component.ngOnChanges();
    const actualKeys = Object.keys(component.contentCreditsData);
    const expectedKeys = ['contributors', 'creators', 'attributions', 'copyright'];
    fixture.detectChanges();
    expect(actualKeys).toEqual(expectedKeys);
    expect(component.contentCreditsData).toBeDefined();
  });

  it('should call closeModal', () => {
    spyOn(component.close, 'emit');
    const modal = { deny: () => jasmine.createSpy() };
    component.closeModal(modal);
    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should call ngOnDestroy', () => {
    spyOn(component['unsubscribe'], 'next');
    spyOn(component['unsubscribe'], 'complete');
    component.ngOnDestroy();
    expect(component['unsubscribe'].next).toHaveBeenCalled();
    expect(component['unsubscribe'].complete).toHaveBeenCalled();
  });

});
