import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShareLinkComponent } from './share-link.component';
import { ResourceService, ConfigService } from '../../services/index';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Response } from './share-link.component.spec.data';
import { By } from '@angular/platform-browser';
describe('ShareLinkComponent', () => {
  let component: ShareLinkComponent;
  let fixture: ComponentFixture<ShareLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule , HttpClientTestingModule ],
      declarations: [ShareLinkComponent],
      providers: [ResourceService, ConfigService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareLinkComponent);
    component = fixture.componentInstance;
  });
  xit('should take content share INPUT and return the base64 link ', () => {
    component.contentShare = Response.contentShare;
    spyOn(component, 'getBase64Url').and.callThrough();
    component.getBase64Url('content', 'do_1124786006384066561162');
    spyOn(component, 'getUnlistedShareUrl').and.callThrough();
    component.getUnlistedShareUrl();
    fixture.detectChanges();
  });
  xit('Should show the content share model', () => {
    spyOn(component, 'initializeModal').and.callThrough();
    component.initializeModal();
    expect(component.sharelinkModal).toBeDefined();
    expect(component.sharelinkModal).toBeTruthy();
  });
});
