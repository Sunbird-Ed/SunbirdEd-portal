import {
  servicemockRes,
  contentList,
  contentListWithHoverData,
  contentHierarchyDateSet1,
  processData,
  processedOutputData,
  duplicateData,
  nonDuplicateData,
  courseSectionFacetData,
  parsedCourseFacetData,
  courseFilters,
  requiredProperties,
  colorSet,
  iconObj
} from './util.service.spec.data';
import {TestBed, inject } from '@angular/core/testing';
import { configureTestSuite } from '@sunbird/test-util';
import { UtilService } from './util.service';
import { ResourceService } from '../resource/resource.service';
import { ExportToCsv } from 'export-to-csv';
import * as _ from 'lodash-es';
import { ToasterService } from '@sunbird/shared';

const resourceBundle = {
  messages: {
    stmsg: {
      m0140: 'DOWNLOADING',
      m0143: 'DOWNLOAD',
      m0139: 'DOWNLOADED',
      m0142: 'PAUSED'
    }
  },
  frmelmnts: {
    lbl: {
      goToMyDownloads: 'Goto My Downloads',
      saveToPenDrive: 'Save to Pendrive',
      open: 'Open'
    },
    btn: {
      download: 'Download'
    }
  }
};

describe('UtilService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilService, { provide: ResourceService, useValue: resourceBundle }, ToasterService]
    });
  });

  it('should be created', inject([UtilService, ResourceService], (service: UtilService, resourceService: ResourceService) => {
    expect(service).toBeTruthy();
  }));

  it('should call manipulateSoftConstraint when filter present',
    inject([UtilService], (service: UtilService) => {
      const softConstraintData = {
        filters: {
          channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
          board: ['NCERT']
        },
        softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
        mode: 'soft'
      };
      const userFrameworkData = {
        board: ['CBSE']
      };
      const filter = true;
      const softconstraintsdata = service.manipulateSoftConstraint(filter, softConstraintData, userFrameworkData);
      expect(service.manipulateSoftConstraint).toBeDefined();
      expect(softconstraintsdata).toBeFalsy();
    }));

  it('should call manipulateSoftConstraint when filters are not present and userFrameworkData is present',
    inject([UtilService], (service: UtilService) => {
      const softConstraintData = {
        filters: {
          channel: 'b00bc992ef25f1a9a8d63291e20efc8d',
          board: ['NCERT']
        },
        softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
        mode: 'soft'
      };
      const userFrameworkData = {
        board: ['CBSE']
      };
      const filter = undefined;
      const softconstraintsdata = service.manipulateSoftConstraint(filter, softConstraintData, userFrameworkData);
      expect(service.manipulateSoftConstraint).toBeDefined();
      expect(softconstraintsdata).toEqual({ filters: userFrameworkData, mode: 'soft' });
    }));

  it('should have showAppPopUp to be false', inject([UtilService], (service: UtilService) => {
    expect(service.showAppPopUp).toBeFalsy();
  }));

  it('should call getDataForCard method', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'getDataForCard').and.callThrough();
    service.getDataForCard(null, null, null, null);
    expect(service.getDataForCard).toBeTruthy();
  }));

  it('should call processContent method', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'processContent').and.callThrough();
    service.processContent({ name: null }, null, null, null);
    expect(service.processContent).toBeTruthy();
  }));

  it('should call getTopicSubTopic method', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'getTopicSubTopic').and.callThrough();
    service.getTopicSubTopic(null, null);
    expect(service.getTopicSubTopic).toBeTruthy();
  }));

  it('should call toggleAppPopup method', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'toggleAppPopup').and.callThrough();
    service.toggleAppPopup();
    expect(service.toggleAppPopup).toBeTruthy();
  }));

  it('should call manipulateSoftConstraint method', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'manipulateSoftConstraint').and.callThrough();
    service.manipulateSoftConstraint(null, null, null);
    expect(service.manipulateSoftConstraint).toBeTruthy();
  }));

  it('should call translateValues method', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'translateValues').and.callThrough();
    service.translateValues(null, null);
    expect(service.translateValues).toBeTruthy();
  }));

  it('should call convert method', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'convert').and.callThrough();
    service.convert({ translations: null }, null);
    expect(service.convert).toBeTruthy();
  }));

  it('should call translateLabel method', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'translateLabel').and.callThrough();
    service.translateLabel({ translations: null }, null);
    expect(service.translateLabel).toBeTruthy();
  }));

  it('should call convertSelectedOption method', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'convertSelectedOption').and.callThrough();
    service.convertSelectedOption(null, null, null, null);
    expect(service.convertSelectedOption).toBeTruthy();
  }));

  it('should call getPlayerDownloadStatus() when status is Download', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'getPlayerDownloadStatus').and.callThrough();
    service.getPlayerDownloadStatus('DOWNLOAD', servicemockRes.successResult.result.content, 'browse');
    expect(service.getPlayerDownloadStatus).toBeTruthy();
  }));

  it('should call getPlayerDownloadStatus() when status is Downloading ', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'getPlayerDownloadStatus').and.callThrough();
    service.getPlayerDownloadStatus('DOWNLOADING', servicemockRes.successResult.result.content, 'browse');
    expect(service.getPlayerDownloadStatus).toBeTruthy();
  }));

  it('should call getPlayerDownloadStatus() when status is Downloading ', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'getPlayerDownloadStatus').and.callThrough();
    service.getPlayerDownloadStatus('DOWNLOADING', servicemockRes.successResult2.result.content, 'browse');
    expect(service.getPlayerDownloadStatus).toBeTruthy();
  }));
  it('should call getPlayerDownloadStatus() when status is Downloading ', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'getPlayerDownloadStatus').and.callThrough();
    service.getPlayerDownloadStatus('DOWNLOADING', servicemockRes.successResult3.result.content, 'browse');
    expect(service.getPlayerDownloadStatus).toBeTruthy();
  }));
  it('should call getPlayerDownloadStatus() when status is Downloading ', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'getPlayerDownloadStatus').and.callThrough();
    service.getPlayerDownloadStatus('DOWNLOAD', servicemockRes.successResult4.result.content, 'browse');
    expect(service.getPlayerDownloadStatus).toBeTruthy();
  }));

  it('should call getPlayerDownloadStatus() and return false', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'getPlayerDownloadStatus').and.callThrough();
    service.getPlayerDownloadStatus('DOWNLOADING', servicemockRes.successResult.result.content, 'library');
    expect(service.getPlayerDownloadStatus).toBeTruthy();
  }));

  it('should call getPlayerUpdateStatus() when status is update', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'getPlayerUpdateStatus').and.callThrough();
    service.getPlayerUpdateStatus('UPDATE', servicemockRes.successResult.result.content, 'library', true);
    expect(service.getPlayerUpdateStatus).toBeTruthy();
  }));

  it('should call getPlayerUpdateStatus() when status is downloading', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'getPlayerUpdateStatus').and.callThrough();
    service.getPlayerUpdateStatus('DOWNLOADING', servicemockRes.successResult.result.content, 'library', true);
    expect(service.getPlayerUpdateStatus).toBeTruthy();
  }));

  it('should call getPlayerUpdateStatus() and return false', inject([UtilService], (service: UtilService) => {
    spyOn(service, 'getPlayerUpdateStatus').and.callThrough();
    service.getPlayerUpdateStatus('UPDATE', servicemockRes.successResult.result.content, 'browse', false);
    expect(service.getPlayerUpdateStatus).toBeTruthy();
  }));

  it('should return given contentList with the updated hover data', inject([UtilService, ResourceService],
    (service: UtilService, resourceService: ResourceService) => {
      const listWithHoverData = service.addHoverData(contentList, true);
      expect(listWithHoverData[0].hoverData.actions[0].type).toEqual('download');
      expect(listWithHoverData[0].hoverData.actions[0].disabled).toEqual(true);
    }));

  it('should emit languageChange Event', inject([UtilService, ResourceService],
    (service: UtilService, resourceService: ResourceService) => {
      const language = { value: 'hi', label: 'Hindi', dir: 'ltr' };
      spyOn(service.languageChange, 'emit');
      service.emitLanguageChangeEvent(language);
      expect(service.languageChange.emit).toHaveBeenCalledWith(language);
    }));

  it('should call emitHideHeaderTabsEvent', inject([UtilService, ResourceService],
    (service: UtilService, resourceService: ResourceService) => {
      spyOn(service.hideHeaderTabs, 'emit');
      service.emitHideHeaderTabsEvent(true);
      expect(service.hideHeaderTabs.emit).toHaveBeenCalledWith(true);
    }));

  it('should parse data into json', inject([UtilService, ResourceService],
    (service: UtilService, resourceService: ResourceService) => {
      const parsedData = service.parseJson('{"data":true}');
      expect(parsedData).toEqual({'data': true});
    }));

  it('should not parse data and throw error', inject([UtilService, ResourceService],
    (service: UtilService, resourceService: ResourceService) => {
      try {
        service.parseJson('data');
      } catch (e) {
        expect(e).toEqual(new Error('ERROR_PARSING_STRING'));
      }
    }));

  it('should not parse data and throw error as data is null', inject([UtilService, ResourceService],
    (service: UtilService, resourceService: ResourceService) => {
      try {
        service.parseJson(null);
      } catch (e) {
        expect(e).toEqual(new Error('ERROR_PARSING_STRING'));
      }
    }));

  it('should call emit event searchKeyword', inject([UtilService, ResourceService],
    (service: UtilService, resourceService: ResourceService) => {
      spyOn(service.searchKeyword, 'emit');
      service.updateSearchKeyword('test');
      expect(service.searchKeyword.emit).toHaveBeenCalledWith('test');
    }));

  it('should return  isAvailable true ', inject([UtilService, ResourceService],
      (service: UtilService, resourceService: ResourceService) => {
        const data = service.isAvailable(contentListWithHoverData[0]);
        expect(data).toBeTruthy();
  }));

  it('should return  isAvailable true ', inject([UtilService, ResourceService],
    (service: UtilService, resourceService: ResourceService) => {
      const data = service.isDownloaded(contentListWithHoverData[0], 'DOWNLOADED');
      expect(data).toBeTruthy();
  }));

  it('should return  isAvailable true ', inject([UtilService, ResourceService],
    (service: UtilService, resourceService: ResourceService) => {
      const data = service.isDownloaded(contentListWithHoverData[0], 'DOWNLOAD');
      expect(data).toBeFalsy();
  }));

  it('should return  sorted tree', inject([UtilService], (service: UtilService) => {
      const data = service.sortChildrenWithIndex(contentHierarchyDateSet1.before);
      expect(data).toEqual(contentHierarchyDateSet1.after);
  }));

  it('should return  process data', inject([UtilService], (service: UtilService) => {
    const data = service.processData(processData, ['channel', 'gradeLevel', 'subject', 'medium']);
    expect(data).toEqual(processedOutputData);
  }));

  it('should return process unique data', inject([UtilService], (service: UtilService) => {
    const data = service.removeDuplicateData([{'x': 1}, {'x': 2}, {'x': 1}], 'x');
    expect(data).toEqual([{'x': 1}, {'x': 2}]);
  }));

  it('should return process unique data and return non unique data', inject([UtilService], (service: UtilService) => {
    const data = service.removeDuplicate(duplicateData);
    expect(data).toEqual(nonDuplicateData);
  }));

  it('should return processed course facet data', inject([UtilService], (service: UtilService) => {
    const data = service.processCourseFacetData(courseSectionFacetData, courseSectionFacetData.keys);
    expect(data).toEqual(parsedCourseFacetData);
  }));

  it ('should return only required properties', inject([UtilService], (service: UtilService) => {
    const content = service.reduceTreeProps(requiredProperties, ['mimeType', 'visibility', 'identifier', 'selected', 'name', 'contentType', 'children',
    'primaryCategory', 'additionalCategory', 'parent']);
    expect(content).toEqual(requiredProperties);
  }));

  it ('should create instance of ExportToCsv', inject([UtilService], (service: UtilService)  => {
    const data = [{
      identifier: '87cb1e5b-16cf-4160-9a2c-7384da0ae97f',
      indexOfMember: 0,
      initial: 'C',
      progress: '0',
      title: 'Content Creactor(You)'
    }];
    service.downloadCSV(contentList[0], data);
    expect(service['csvExporter'] instanceof ExportToCsv).toBeTruthy();
  }));

  it('should call isDesktopApp', inject([UtilService], (service: UtilService)  => {
    service['_isDesktopApp'] = true;
    expect(service.isDesktopApp).toBe(true);
  }));

  it('should call clearSearchQuery', inject([UtilService], (service: UtilService)  => {
    spyOn(service['searchQuery'], 'next');
    service.clearSearchQuery();
    expect(service['searchQuery'].next).toHaveBeenCalled();
  }));

  it('should call getAppBaseUrl', inject([UtilService], (service: UtilService)  => {
    const dummyElement = document.createElement('input');
    dummyElement.value = 'http://localhost:3000';
    spyOn(document, 'getElementById').and.returnValue(dummyElement);
    const origin = service.getAppBaseUrl();
    expect(origin).toEqual('http://localhost:3000');
  }));

  it('should call getAppBaseUrl', inject([UtilService], (service: UtilService)  => {
    const origin = service.getAppBaseUrl();
    expect(origin).toEqual('http://localhost:9876');
  }));

  it('should get random color', inject([UtilService], (service: UtilService)  => {
    const randomColor = service.getRandomColor(colorSet);
    expect(Object.keys(randomColor)).toContain('iconBgColor');
    expect(Object.keys(randomColor)).toContain('pillBgColor');
  }));

  it('should return random color as null', inject([UtilService], (service: UtilService)  => {
    const randomColor = service.getRandomColor([]);
    expect(randomColor).toBeNull();
  }));

  it('should return icon for selected pill', inject([UtilService], (service: UtilService)  => {
    const icon = service.getSectionPillIcon(iconObj, 'english');
    expect(icon).toEqual('assets/images/book_english.svg');
  }));

  it('should return default icon for selected pill', inject([UtilService], (service: UtilService)  => {
    const icon = service.getSectionPillIcon(iconObj, 'random');
    expect(icon).toEqual('assets/images/book_default.svg');
  }));

});
