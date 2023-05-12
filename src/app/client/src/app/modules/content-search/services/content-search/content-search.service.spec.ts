import { FrameworkService, ChannelService } from '../../../core';
import { ContentSearchService } from './content-search.service';
import { of } from "rxjs";


describe('ContentSearchService', () => {

  let contentSearchService: ContentSearchService;

  const mockFrameworkService: Partial<FrameworkService> = {};
  const mockChannelService: Partial<ChannelService> = {
    getFrameWork: jest.fn(() => of({
      'id': 'api.channel.read',
      'ver': '1.0',
      'ts': '2018-12-20T04:59:00.682Z',
      'params': {
        'resmsgid': 'f706d2a0-0413-11e9-aacc-e1c6fb1097e2',
        'msgid': 'f7043a90-0413-11e9-9e67-2b0d8139a4c4',
        'status': 'successful',
        'err': null,
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'channel': {
          'identifier': '01285019302823526477',
          'code': '01285019302823526477',
          'frameworks': [
            {
              'identifier': 'NCF',
              'name': 'State (Uttar Pradesh)',
              'objectType': 'Framework',
              'relation': 'hasSequenceMember',
              'description': 'NCF ',
              'index': 1,
              'status': null,
              'depth': null,
              'mimeType': null,
              'visibility': null,
              'compatibilityLevel': null
            },
            {
              'identifier': 'NCFCOPY',
              'name': 'AP Board',
              'objectType': 'Framework',
              'relation': 'hasSequenceMember',
              'description': ' NCF framework..',
              'index': 2,
              'status': null,
              'depth': null,
              'mimeType': null,
              'visibility': null,
              'compatibilityLevel': null
            }
          ],
          'consumerId': '9393568c-3a56-47dd-a9a3-34da3c821638',
          'channel': 'in.ekstep',
          'description': 'description',
          'createdOn': '2018-03-27T11:08:49.677+0000',
          'versionKey': '1545195284939',
          'appId': 'dev.sunbird.portal',
          'name': 'channel-2',
          'lastUpdatedOn': '2018-12-19T04:54:44.939+0000',
          'status': 'Live',
          'defaultFramework': 'NCF'
        }
      }
    })),
  };

  beforeAll(() => {
    contentSearchService = new ContentSearchService(
      mockFrameworkService as FrameworkService,
      mockChannelService as ChannelService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(contentSearchService).toBeTruthy();
  });

  it('should be  call initialize', () => {
    const mockData = { channelId: '01285019302823526477', custodianOrg: false, defaultBoard: 'CBSE' };
    jest.spyOn(contentSearchService, 'initialize');
    contentSearchService.initialize(mockData.channelId, mockData.custodianOrg, mockData.defaultBoard);
    expect(contentSearchService.initialize).toHaveBeenCalledWith(mockData.channelId, mockData.custodianOrg, mockData.defaultBoard);
  });

  it('should be  call initialize for custodian org', () => {
    const mockData = { channelId: '01285019302823526477', custodianOrg: true, defaultBoard: 'CBSE' };
    jest.spyOn(contentSearchService, 'initialize');
    contentSearchService.initialize(mockData.channelId, mockData.custodianOrg, mockData.defaultBoard);
    expect(contentSearchService.initialize).toHaveBeenCalledWith(mockData.channelId, mockData.custodianOrg, mockData.defaultBoard);
  });

  it('should be  call fetchFilter', () => {
    jest.spyOn(contentSearchService, 'fetchFilter');
    contentSearchService.fetchFilter();
    expect(contentSearchService.fetchFilter).toHaveBeenCalled();
  });

  it('should be  call fetchChannelData', () => {
    jest.spyOn(contentSearchService, 'fetchChannelData');
    contentSearchService.fetchChannelData();
    expect(contentSearchService.fetchChannelData).toHaveBeenCalled();
  });

  it('should map categories to new keys', () => {
    const input = { subject: [], medium: [], gradeLevel: [], board: [], contentType: 'course' };
    const result = contentSearchService.mapCategories({ filters: input });
    expect(result).toEqual({ subject: [], se_mediums: [], se_gradeLevels: [], se_boards: [], contentType: 'course' });
  });

});
