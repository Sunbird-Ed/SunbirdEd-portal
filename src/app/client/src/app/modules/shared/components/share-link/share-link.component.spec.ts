import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShareLinkComponent } from './share-link.component';
import { ResourceService, ConfigService, BrowserCacheTtlService } from '../../services/index';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Response } from './share-link.component.spec.data';
import { By } from '@angular/platform-browser';
import { CacheService } from 'ng2-cache-service';
describe('ShareLinkComponent', () => {
  let component: ShareLinkComponent;
  let fixture: ComponentFixture<ShareLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule , HttpClientTestingModule ],
      declarations: [ShareLinkComponent],
      providers: [ResourceService, ConfigService, CacheService, BrowserCacheTtlService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareLinkComponent);
    component = fixture.componentInstance;
  });
  it('should take content share link  INPUT  ', () => {
    component.shareLink = Response.contentShare;
    expect(component.sharelinkModal).toBeDefined();
    expect(component.sharelinkModal).toBeFalsy();
    expect(component.shareLink).toBeDefined();
    expect(component.shareLink).toBe(Response.contentShare);
  });
  it('Should show the content share model', () => {
    spyOn(component, 'initializeModal').and.callThrough();
    component.initializeModal();
    expect(component.sharelinkModal).toBeFalsy();
  });
});
