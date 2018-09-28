import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContentCreditsComponent } from './content-credits.component';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '../../services/index';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Response } from './content-credits.component.spec.data';
import { By } from '@angular/platform-browser';
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
  it('should take content credits as  INPUT  ', () => {
    component.contentCreditsData = Response.contentCreditsData;
    expect(component.showContentCreditModal).toBeDefined();
    expect(component.showContentCreditModal).toBeFalsy();
    expect(component.contentCreditsData).toBeDefined();
  });
});
