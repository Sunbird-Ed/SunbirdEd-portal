import { TelemetryModule } from '@sunbird/telemetry';

import {of as observableOf, throwError } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionPlayerComponent } from './collection-player.component';
import { PlayerService, CoreModule, CopyContentService, UserService } from '@sunbird/core';
import { ActivatedRoute } from '@angular/router';
import { WindowScrollService, SharedModule, ResourceService, NavigationHelperService, ToasterService } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CollectionHierarchyGetMockResponse } from './collection-player.spec.data';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { configureTestSuite } from '@sunbird/test-util';

describe('CollectionPlayerComponent', () => {
  let component: CollectionPlayerComponent;
  let fixture: ComponentFixture<CollectionPlayerComponent>;
  const collectionId = 'do_112270591840509952140';
  const contentId = 'domain_44689';

  const fakeActivatedRoute = {
    params: observableOf({ collectionId: collectionId }),
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
      },
      'smsg': {
        'm0042' : 'Content successfully copied'
      },
      'emsg' : {
        'm0008' : 'Could not copy content. Try again later'
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
  configureTestSuite();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionPlayerComponent],
      imports: [SuiModule, HttpClientTestingModule, CoreModule, SharedModule.forRoot(), RouterTestingModule , TelemetryModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [ CopyContentService, ResourceService, NavigationHelperService, { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        { provide: ResourceService, useValue: resourceBundle }, UserService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionPlayerComponent);
    component = fixture.componentInstance;
    component.queryParams = { contentId: 'domain_44689'};
    component.cancelInteractEdata = {
      id: 'cancel-button',
      type: 'click',
      pageid: 'collection-player'
    };
    component.createCourseInteractEdata = {
      id: 'create-course-button',
      type: 'click',
      pageid: 'collection-player'
    };
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.showPlayer).toBeFalsy();
    // expect(component.serviceUnavailable).toBeFalsy();
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
      .returnValue(observableOf(CollectionHierarchyGetMockResponse.collectionHierarchyData));
    component.ngOnInit();
    expect(component.collectionTreeNodes).toEqual({ data: CollectionHierarchyGetMockResponse.collectionHierarchyData.result.content });
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

  it('should copy a textbook as course if api gives success response', () => {
    const userService = TestBed.get(UserService);
    userService['userOrgDetails$'] = observableOf({});
    const contentData = CollectionHierarchyGetMockResponse.copyCourseContentData;
    const copyContentService = TestBed.get(CopyContentService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'success').and.stub();
    spyOn(copyContentService, 'copyAsCourse').and.returnValue(observableOf(CollectionHierarchyGetMockResponse.copyContentSuccess));
    component.createCourse();
    expect(component.showCopyLoader).toBeFalsy();
    expect(toasterService.success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m0042);
  });

  it('should not copy a textbook as course if api is does not give success response', () => {
    const userService = TestBed.get(UserService);
    userService['userOrgDetails$'] = observableOf({});
    const contentData = CollectionHierarchyGetMockResponse.copyCourseContentData;
    const copyContentService = TestBed.get(CopyContentService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.stub();
    spyOn(component, 'clearSelection').and.stub();
    spyOn(copyContentService, 'copyAsCourse').and.callFake(() => throwError(CollectionHierarchyGetMockResponse.copyContentFailed));
    component.createCourse();
    expect(component.clearSelection).toHaveBeenCalled();
    expect(component.showCopyLoader).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0008);
  });

  it(`should show/hide 'create course' and 'cancel' button `, () => {
    component.isCopyAsCourseClicked = false;
    component.copyAsCourse();
    expect(component.isCopyAsCourseClicked).toBe(true);
  });

  it('should clear intended actions and makes the toc as default', () => {
    component.collectionData = CollectionHierarchyGetMockResponse.copyContentDataBeforeClear;
    component.isCopyAsCourseClicked = true;
    component.clearSelection();
    expect(component.isCopyAsCourseClicked).toBe(false);
    expect(component.selectAll).toBe(false);
    expect(component.collectionData).toEqual(CollectionHierarchyGetMockResponse.copyContentDataAfterClear);
  });

  it('should select/unselect all the checkboxes of the textbook units', () => {
    component.selectAll = false;
    component.selectAllItem();
    expect(component.selectAll).toBe(true);
  });

  it('should set the flag to show no content message', () => {
    const event = {message: 'No Content Available'};
    component.showNoContent(event);
    expect(component.isContentPresent).toBe(false);
  });

  it('should set activeFilters value', () => {
    const event = { data: { value: [ 'video/mp4', 'video/x-youtube', 'video/webm' ]}};
    component.selectedFilter(event);
    expect(component.activeMimeTypeFilter).toEqual([ 'video/mp4', 'video/x-youtube', 'video/webm' ]);
  });

  it('should close player and redirect to resource page', () => {
    const navigateHelperService = TestBed.get(NavigationHelperService);
    spyOn(navigateHelperService, 'navigateToPreviousUrl').and.stub();
    component.closeCollectionPlayer();
    expect(navigateHelperService.navigateToPreviousUrl).toHaveBeenCalledWith('/resources');
  });

  it('should copy a textbook', () => {
    const contentData = CollectionHierarchyGetMockResponse.copyCourseContentData;
    const copyContentService = TestBed.get(CopyContentService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'success').and.stub();
    spyOn(copyContentService, 'copyContent').and.returnValue(observableOf(CollectionHierarchyGetMockResponse.copyContentSuccess));
    component.copyContent(contentData);
    expect(component.showCopyLoader).toBeFalsy();
    expect(toasterService.success).toHaveBeenCalledWith(resourceBundle.messages.smsg.m0042);
  });

  it('should not copy a textbook if api fails', () => {
    const contentData = CollectionHierarchyGetMockResponse.copyCourseContentData;
    const copyContentService = TestBed.get(CopyContentService);
    const toasterService = TestBed.get(ToasterService);
    spyOn(toasterService, 'error').and.stub();
    spyOn(copyContentService, 'copyContent').and.callFake(() => throwError(CollectionHierarchyGetMockResponse.copyContentFailed));
    component.copyContent(contentData);
    expect(component.showCopyLoader).toBeFalsy();
    expect(toasterService.error).toHaveBeenCalledWith(resourceBundle.messages.emsg.m0008);
  });

  it('should call handleSelectAll() if select all checkbox is checked/unchecked', () => {
    const event = {selectAll: true};
    spyOn(component, 'handleSelectAll').and.stub();
    component.handleSelectedItem(event);
    expect(component.handleSelectAll).toHaveBeenCalledWith(event);
  });

  it('should push the selected item into the array', () => {
    // It will generate a random number between 0 to 4(exclusive)
    const index = Math.floor(Math.random() * 4);
    // It will randomly select any children data of the textbook
    const mockData = CollectionHierarchyGetMockResponse.eventDataWithContent.children[index];
    mockData['selected'] = true;
    const event = {
      data: mockData
    };
    component.handleSelectedItem(event);
    expect(component.selectedItems.length).toBe(1);
  });

  it('should remove the selected item from the array', () => {
    const containerArrayLength  = CollectionHierarchyGetMockResponse.eventDataWithContent.children.length;
    const index = Math.floor(Math.random() * 4);
    const mockData = CollectionHierarchyGetMockResponse.eventDataWithContent.children[index];
    mockData['selected'] = false;
    component.selectedItems = CollectionHierarchyGetMockResponse.eventDataWithContent.children;
    component.selectedItems[index]['selected'] = false;
    const event = {
      data: mockData
    };
    component.handleSelectedItem(event);
    expect(component.selectedItems.length).toEqual(containerArrayLength - 1);
  });

  it('should select all the units of the textbook and push into the array', () => {
    const mockData = CollectionHierarchyGetMockResponse.eventDataWithContent.children;
    mockData.forEach( (item) => {
      item['selected'] = true;
    });
    const event = {
      selectAll: true,
      data: mockData
    };
    component.handleSelectAll(event);
    expect(component.selectedItems.length).toEqual(mockData.length);
  });

  it(`should make the containing array empty when user un-check 'Select all'`, () => {
    const event = {
      selectAll: false,
    };
    component.handleSelectAll(event);
    expect(component.selectedItems.length).toEqual(0);
  });
});
