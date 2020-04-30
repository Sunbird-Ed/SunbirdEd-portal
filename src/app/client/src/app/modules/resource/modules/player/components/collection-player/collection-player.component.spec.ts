import { TelemetryModule } from '@sunbird/telemetry';

import {of as observableOf } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionPlayerComponent } from './collection-player.component';
import { PlayerService, CoreModule } from '@sunbird/core';
import { ActivatedRoute } from '@angular/router';
import { WindowScrollService, SharedModule, ResourceService, NavigationHelperService } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CollectionHierarchyGetMockResponse } from './collection-player.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CollectionPlayerComponent', () => {
  let component: CollectionPlayerComponent;
  let fixture: ComponentFixture<CollectionPlayerComponent>;
  const collectionId = 'do_112270591840509952140';
  const contentId = 'domain_44689';

  const fakeActivatedRoute = {
    params: observableOf({ id: collectionId }),
    queryParams: observableOf({ contentId: contentId }),
    snapshot: {
      data: {
        telemetry: {
          env: 'get', pageid: 'get', type: 'edit', subtype: 'paginate'
        }
      }
    }
  };

  const resourceBundle = {
    'messages': {
      'stmsg': {
        'm0118': 'No content to play'
      }
    },
    'frmelmnts': {
      'btn': {
        'all': 'all',
        'video': 'video',
        'interactive': 'interactive',
        'docs': 'docs'
      }
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionPlayerComponent],
      imports: [SuiModule, HttpClientTestingModule, CoreModule, SharedModule.forRoot(), RouterTestingModule , TelemetryModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ ResourceService, NavigationHelperService, { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionPlayerComponent);
    component = fixture.componentInstance;
    component.queryParams = { contentId: 'domain_44689'};
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.showPlayer).toBeFalsy();
    // expect(component.serviceUnavailable).toBeFalsy();
    expect(component.loader).toBeTruthy();
    expect(component.loaderMessage).toEqual({
      headerMessage: 'Please wait...',
      loaderMessage: 'Fetching content details!'
    });
    expect(component.collectionTreeOptions).toEqual({
      fileIcon: 'sb-icon-content sb-fancyTree-icon',
      customFileIcon: {
        'video': 'icon play circle sb-fancyTree-icon',
        'pdf': 'sb-icon-doc sb-fancyTree-icon',
        'youtube': 'icon play circle sb-fancyTree-icon',
        'H5P': 'sb-icon-content sb-fancyTree-icon',
        'audio': 'sb-icon-mp3 sb-fancyTree-icon',
        'ECML': 'sb-icon-content sb-fancyTree-icon',
        'HTML': 'sb-icon-content sb-fancyTree-icon',
        'collection': 'icon folder sb-fancyTree-icon',
        'epub': 'sb-icon-doc sb-fancyTree-icon',
        'doc': 'sb-icon-doc sb-fancyTree-icon'
      }
    });
  });

  it('should call playContent method', () => {
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    const content = {
      id: 'do_112474267785674752118',
      title: 'Test'
    };
    component.playContent(content);
    expect(component.showPlayer).toBeTruthy();
    expect(component.contentTitle).toEqual(content.title);
  });
  it('should get content based on route/query params', () => {
    const playerService: PlayerService = TestBed.get(PlayerService);
    const windowScrollService = TestBed.get(WindowScrollService);
    spyOn(windowScrollService, 'smoothScroll');
    spyOn(playerService, 'getCollectionHierarchy').and
      .returnValue(observableOf(CollectionHierarchyGetMockResponse));
    component.ngOnInit();
    expect(component.collectionTreeNodes).toEqual({ data: CollectionHierarchyGetMockResponse.result.content });
    expect(component.loader).toBeFalsy();
  });

  it('should set dialcode to the telemetryCdata if any', () => {
    component.dialCode = 'D4R4K4';
    spyOn<any>(component, 'getCollectionHierarchy').and.callThrough();
    component['getContent']();
    expect(component['getCollectionHierarchy']).toHaveBeenCalled();
  });

  it('should open the pdfUrl in a new tab', () => {
    spyOn(window, 'open').and.callThrough();
    component.printPdf('www.samplepdf.com');
    expect(window.open).toHaveBeenCalledWith('www.samplepdf.com', '_blank');
  });
});
