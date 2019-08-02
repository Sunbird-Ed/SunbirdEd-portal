import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentCreditsComponent } from './content-credits.component';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '@sunbird/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Response } from './content-credits.component.spec.data';
import { CacheService } from 'ng2-cache-service';
describe('ContentCreditsComponent', () => {
  let component: ContentCreditsComponent;
  let fixture: ComponentFixture<ContentCreditsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule , HttpClientTestingModule ],
      declarations: [ContentCreditsComponent],
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
});
