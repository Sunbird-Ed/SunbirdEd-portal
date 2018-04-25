import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ShareLinkComponent } from './share-link.component';
import { ResourceService, ConfigService } from '../../services/index';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
describe('ShareLinkComponent', () => {
  let component: ShareLinkComponent;
  let fixture: ComponentFixture<ShareLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule , HttpClientTestingModule ],
      declarations: [ShareLinkComponent],
      providers: [ResourceService, ConfigService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareLinkComponent);
    component = fixture.componentInstance;
  });
  it('should show TEST INPUT for success data', () => {
    component.contentShareLink = 'http://localhost:3000/unlisted/Y29sbGVjdGlvbi9kb18xMTI0Nzg2MDA2Mzg0MDY2NTYxMTYy';
    fixture.detectChanges();
  });
});
