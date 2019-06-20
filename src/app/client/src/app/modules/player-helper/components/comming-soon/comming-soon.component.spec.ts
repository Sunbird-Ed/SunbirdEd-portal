import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommingSoonComponent } from './comming-soon.component';
import { ResourceService, BrowserCacheTtlService, SharedModule } from '@sunbird/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SuiModule } from 'ng2-semantic-ui';
import { of as observableOf } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { CacheService } from 'ng2-cache-service';
import { UserService, OrgDetailsService } from '@sunbird/core';
import { commonMessageApiResp } from './comming-soon.component.spec.data';


describe('CommingSoonComponent', () => {
  let component: CommingSoonComponent;
  let fixture: ComponentFixture<CommingSoonComponent>;
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const resourceBundle = {
    'messages': {
      'stmsg': {
        'm0122': 'default comming soon'
      },
      'fmsg': {
        'm0077': 'Fetching search result failed',
        'm0051': 'Fetching other courses failed, please try again later...'
      }
    },
    languageSelected$: observableOf({})
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiModule , HttpClientTestingModule, SharedModule.forRoot()],
      declarations: [CommingSoonComponent],
      providers: [ResourceService, UserService, OrgDetailsService, CacheService, BrowserCacheTtlService,
      { provide: ResourceService, useValue: resourceBundle }, { provide: Router, useClass: RouterStub }, ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(CommingSoonComponent);
    component = fixture.componentInstance;
  });

  it('should set custom comming soon message from api response', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    spyOn(orgDetailsService, 'getCommingSoonMessage').and.returnValue(observableOf(commonMessageApiResp));
    orgDetailsService._rootOrgId = 'b00bc992ef25f1a9a8d63291e20efc8d';
    component.ngOnInit();
    expect(component.commingSoonMessage).toEqual('Org specific coming soon message');
  });

  it('should show default comming soon message if custom comming soon doesnt exists', () => {
    const orgDetailsService = TestBed.get(OrgDetailsService);
    orgDetailsService._rootOrgId = 'org_002';
    spyOn(orgDetailsService, 'getCommingSoonMessage').and.returnValue(observableOf({}));
    component.ngOnInit();
    expect(component.commingSoonMessage).toEqual('default comming soon');
  });

});
