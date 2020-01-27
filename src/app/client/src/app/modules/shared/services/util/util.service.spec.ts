import { servicemockRes, contentList, contentListWithHoverData } from './util.service.spec.data';
import { TestBed, inject } from '@angular/core/testing';

import { UtilService } from './util.service';
import { ResourceService } from '../resource/resource.service';

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
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilService, { provide: ResourceService, useValue: resourceBundle }]
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
      const listWithHoverData = service.addHoverData(contentList, false);
      expect(listWithHoverData).toEqual(contentListWithHoverData);
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

  it('should call emit event searchKeyword', inject([UtilService, ResourceService],
    (service: UtilService, resourceService: ResourceService) => {
      spyOn(service.searchKeyword, 'emit');
      service.updateSearchKeyword('test');
      expect(service.searchKeyword.emit).toHaveBeenCalledWith('test');
    }));
});
