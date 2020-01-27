import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CollectionTreeComponent } from './collection-tree.component';
import { SuiAccordionModule } from 'ng2-semantic-ui';
import { FancyTreeComponent } from '..';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { of as observableOf, Observable } from 'rxjs';
// Import services
import { nodes, commonMessageApiResp } from './collection-tree.component.spec.data';
import { ResourceService, BrowserCacheTtlService, ConfigService, ToasterService } from '@sunbird/shared';
import { UserService, OrgDetailsService } from '@sunbird/core';
import { ActivatedRoute, Router } from '@angular/router';


import { CacheService } from 'ng2-cache-service';
describe('CollectionTreeComponent', () => {
  let component: CollectionTreeComponent;
  let fixture: ComponentFixture<CollectionTreeComponent>;
  const resourceBundle = {
    messages : {
      imsg: { m0027: 'Something went wrong'},
      stmsg: { m0007: 'error', m0006: 'result', m0121: 'default comming soon' }
    },
    languageSelected$: observableOf({})
  };
  class RouterStub {
    navigate = jasmine.createSpy('navigate');
  }
  const fakeActivatedRoute = {
    snapshot: {
      queryParams: {
        dialCode: 'D4R4K4'
      }
    }
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SuiAccordionModule, HttpClientTestingModule, HttpClientModule],
      declarations: [CollectionTreeComponent, FancyTreeComponent],
      providers: [ ResourceService, ToasterService,  { provide: ResourceService, useValue: resourceBundle },
        { provide: Router, useClass: RouterStub }, CacheService, ConfigService, BrowserCacheTtlService,
        { provide: ActivatedRoute, useValue: fakeActivatedRoute }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionTreeComponent);
    component = fixture.componentInstance;
    component.options = {
      folderIcon: 'sb-icon-folder',
      fileIcon: 'sb-icon-content',
      customFileIcon: {
        'video': 'sb-icon-video',
        'pdf': 'sb-icon-doc',
        'youtube': 'sb-icon-video',
        'H5P': 'sb-icon-content',
        'audio': 'sb-icon-mp3',
        'ECML': 'sb-icon-content',
        'HTML': 'sb-icon-content',
        'collection': 'sb-icon-collection',
        'epub': 'sb-icon-doc',
        'doc': 'sb-icon-doc'
      }
    };
  });

  it('should create', () => {
    component.nodes = {
      data: {
        id: '1',
        title: 'node1',
        children: [{
          id: '1.1',
          title: 'node1.1'
        }, {
          id: '1.2',
          title: 'node1.2',
          children: [{
              id: '1.2.1',
              title: 'node1.2.1'
            }]
        },
        {
          id: '1.2',
          title: 'node1.2',
          children: []
        }]
      }
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show custom comming soon message if data doesnt exists', () => {
    const userService = TestBed.get(UserService);
    component.nodes = nodes;
    const orgDetailsService = TestBed.get(OrgDetailsService);
    spyOn(orgDetailsService, 'getCommingSoonMessage').and.returnValue(observableOf(commonMessageApiResp));
    orgDetailsService._rootOrgId = 'b00bc992ef25f1a9a8d63291e20efc8d';
    component.ngOnInit();
    expect(component.commingSoonMessage).toEqual('Org specific coming soon message');
  });

  it('should show default comming soon message if custom comming soon doesnt exists', () => {
    component.nodes = nodes;
    const orgDetailsService = TestBed.get(OrgDetailsService);
    orgDetailsService._rootOrgId = 'org_002';
    spyOn(orgDetailsService, 'getCommingSoonMessage').and.returnValue(observableOf({}));
    component.ngOnInit();
    expect(component.commingSoonMessage).toEqual('default comming soon');
  });
});
