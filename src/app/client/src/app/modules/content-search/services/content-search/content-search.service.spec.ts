import { FrameworkService, ChannelService } from '../../../core';
import { ContentSearchService } from './content-search.service';
import { of } from "rxjs";
import { CslFrameworkService } from '../../../public/services/csl-framework/csl-framework.service';

describe('ContentSearchService', () => {

  let contentSearchService: ContentSearchService;

  const mockFrameworkService: Partial<FrameworkService> = {
    getSelectedFrameworkCategories: jest.fn(),
    };
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

  const mockCslFrameworkService: Partial<CslFrameworkService> = {
    getAlternativeCodeForFilter: jest.fn(() => ['category1', 'category2', 'category3', 'category4']),
    getFrameworkCategories: jest.fn(),
    setDefaultFWforCsl: jest.fn(),
    getFrameworkCategoriesObject : jest.fn(),
    getGlobalFilterCategories: jest.fn(() => ({
      fwCategory1: { },
    })),
  };

  beforeAll(() => {
    contentSearchService = new ContentSearchService(
      mockFrameworkService as FrameworkService,
      mockChannelService as ChannelService,
      mockCslFrameworkService as CslFrameworkService
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

  it('should map categories correctly using getCategoriesMapping', () => {
    contentSearchService.frameworkCategories = {
      fwCategory1: { code: 'code1' },
      fwCategory2: { code: 'code2' },
      fwCategory3: { code: 'code3' },
    };

    const filters = {
      'code1': 'value1',
      'code2': 'value2',
      'code3': 'value3',
    };
    const mappedCategories = contentSearchService.mapCategories({ filters });
    expect(mappedCategories).toEqual({
      'category1': 'value1',
      'category2': 'value2',
      'code3': 'value3',  // Last category code is not mapped
    });
  });

  it('should not map fwCategory4 in mapCategories', () => {
    contentSearchService.frameworkCategories = {
      fwCategory1: { code: 'code1' },
      fwCategory2: { code: 'code2' },
      fwCategory3: { code: 'code3' },
    };

    const filters = {
      'code1': 'value1',
      'code2': 'value2',
      'code3': 'value3',
    };
    const mappedCategories = contentSearchService.mapCategories({ filters });
    expect(mappedCategories['category4']).toBeUndefined();
  });

  it('should return filters when custodianOrg is false or boardName is not provided', () => {
    contentSearchService['custodianOrg'] = false;
    const result = contentSearchService.fetchFilter();
    result.subscribe(filters => {
      expect(filters).toEqual(contentSearchService.filters);
    });
  });

  it('should return filters for the specified boardName', () => {
    contentSearchService['custodianOrg'] = true;
    contentSearchService.frameworkCategories = {
      fwCategory1: { code: 'code1' },
      fwCategory2: { code: 'code2' },
      fwCategory3: { code: 'code3' },
      fwCategory4: { code: 'code4' },
    };

    const boardName = 'SampleBoard';
    const selectedBoard = {
      name: 'SampleBoard',
      identifier: 'sampleIdentifier',
    };

    contentSearchService['_filters'][contentSearchService.frameworkCategories?.fwCategory1?.code] = [selectedBoard];
    mockFrameworkService.getSelectedFrameworkCategories = jest.fn(() => of({
      result: {
        framework: {
          categories: [
            { code: 'code2', terms: ['term1', 'term2'] },
            { code: 'code3', terms: ['term3', 'term4'] },
            { code: 'code4', terms: ['term5', 'term6'] },
          ],
        },
      },
    }) as any
    );

    const result = contentSearchService.fetchFilter(boardName);
    result.subscribe(filters => {
      expect(filters[contentSearchService.frameworkCategories?.fwCategory2?.code]).toEqual(['term1', 'term2']);
      expect(filters[contentSearchService.frameworkCategories?.fwCategory3?.code]).toEqual(['term3', 'term4']);
      expect(filters[contentSearchService.frameworkCategories?.fwCategory4?.code]).toEqual(['term5', 'term6']);
    });
  });

  it('should fetch channel data and set filters accordingly', () => {
    contentSearchService['channelId'] = 'sampleChannelId';
    contentSearchService['custodianOrg'] = true;
    contentSearchService['defaultBoard'] = 'fw1';
    contentSearchService.frameworkCategories = {
      fwCategory1: { code: 'code1' },
      fwCategory2: { code: 'code2' },
      fwCategory3: { code: 'code3' },
      fwCategory4: { code: 'code4' },
    };
    const result = contentSearchService.fetchChannelData();
    result.subscribe(success => {
      expect(success).toBeTruthy();
      expect(contentSearchService._frameworkId).toEqual('fw1');
      expect(contentSearchService['_filters']['code1']).toEqual(['term1', 'term2']);
      expect(contentSearchService['_filters']['code2']).toEqual(['term3', 'term4']);
      expect(contentSearchService['_filters']['code3']).toEqual(['term5', 'term6']);
      expect(contentSearchService['_filters']['code4']).toBeUndefined();
      expect(contentSearchService['_filters']['publisher']).toEqual([{ name: 'Publisher1' }]);
    });
  });

  it('should set filters for fwCategory1 when custodianOrg is false and category.code matches', () => {
    contentSearchService['channelId'] = 'sampleChannelId';
    contentSearchService['custodianOrg'] = false;
    contentSearchService['defaultBoard'] = 'fw1';
    contentSearchService.frameworkCategories = {
      fwCategory1: { code: 'code1' },
      fwCategory2: { code: 'code2' },
      fwCategory3: { code: 'code3' },
      fwCategory4: { code: 'code4' },
    };

    const result = contentSearchService.fetchChannelData();

    result.subscribe(success => {
      expect(success).toBeTruthy();
      expect(contentSearchService._frameworkId).toEqual('fw1');
      expect(contentSearchService['_filters']['code1']).toEqual(['term1', 'term2']);
      expect(contentSearchService['_filters']['code2']).toBeUndefined();
      expect(contentSearchService['_filters']['code3']).toBeUndefined();
      expect(contentSearchService['_filters']['code4']).toBeUndefined();
      expect(contentSearchService['_filters']['publisher']).toBeUndefined();
    });
  });

  it('should return filters when custodianOrg is false or boardName is not provided', ()  => {
    contentSearchService['custodianOrg'] = false;
    const result = contentSearchService.fetchFilter();
    result.subscribe(filters => {
      expect(filters).toEqual(contentSearchService.filters);
    });
  });

  it('should return an observable that skips while data is undefined or null', () => {
    const testData = [1, 2, 3];
    const expectedData = testData.slice();
    const observable$ = contentSearchService.searchResults$;
    const emittedData: any[] = [];
    observable$.subscribe(data => {
      emittedData.push(data);
    });
    contentSearchService['_searchResults$'].next(testData);
    expect(emittedData).toEqual([expectedData]);
  });


});
