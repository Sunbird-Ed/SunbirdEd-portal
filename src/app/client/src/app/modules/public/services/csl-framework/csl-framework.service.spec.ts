import { CslFrameworkService } from './csl-framework.service';
import { CsFrameworkService } from '@project-sunbird/client-services/services/framework';
import { ChannelService } from '@sunbird/core';
import { ConfigService } from '../../../shared/services/config/config.service';
import _ from 'lodash';
import { of, throwError } from 'rxjs';
import { FormService } from '../../../core/services/form/form.service';

describe('CslFrameworkService', () => {
  let service: CslFrameworkService;
  const mockData = {
    exampleProperty: 'exampleValue',
  };
  const csFrameworkServiceMock: Partial<CsFrameworkService> = {
    getFrameworkConfigMap: jest.fn(),
    getFrameworkConfig: jest.fn().mockReturnValue(of(mockData)),
  };

  const channelServiceMock: Partial<ChannelService> = {
    getFrameWork: jest.fn()
  };

  const configServiceMock: Partial<ConfigService> = {
    appConfig: {
      frameworkCatConfig: {
        changeChannel: true,
        defaultFW: 'channelDefaultFramework'
      }
    }
  };

  const mockFormService: Partial<FormService> = {
    getFormConfig: jest.fn() as any,
  };

  beforeEach(() => {
    service = new CslFrameworkService(
      csFrameworkServiceMock as CsFrameworkService,
      channelServiceMock as ChannelService,
      configServiceMock as ConfigService,
      mockFormService as FormService
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set default framework and fetch from channel service', () => {
    const setDefaultFWSpy = jest.spyOn(service, 'setDefaultFWforCsl');
    const setFWCatConfigSpy = jest.spyOn(service, 'setFWCatConfigFromCsl');

    service.setDefaultFWforCsl();

    expect(setDefaultFWSpy).toHaveBeenCalled();
    expect(setFWCatConfigSpy).toHaveBeenCalled();
  });

  it('should fetch framework categories object', () => {
    const getFrameworkCategoriesObjectSpy = jest.spyOn(service, 'getFrameworkCategoriesObject');
    service.getFrameworkCategoriesObject();
    expect(getFrameworkCategoriesObjectSpy).toHaveBeenCalled();
  });

  it('should fetch framework categories', () => {
    const getFrameworkCategoriesSpy = jest.spyOn(service, 'getFrameworkCategories');
    service.getFrameworkCategories();
    expect(getFrameworkCategoriesSpy).toHaveBeenCalled();
  });

  it('should resolve the Promise and log if userSelFramework is not provided', async () => {
    const spyConsoleLog = jest.spyOn(console, 'log');
    const userSelFramework = undefined;
    await service.setFWCatConfigFromCsl(userSelFramework);
    expect(spyConsoleLog).toHaveBeenCalledWith('userSelFramework not found');
    expect(localStorage.getItem('fwCategoryObject')).toBeNull();
  });

  it('should log a message when userSelFramework is not provided', () => {
    const consoleLogSpy = jest.spyOn(console, 'log');
    service.setFwCatObjConfigFromCsl(undefined);
    expect(consoleLogSpy).toHaveBeenCalledWith('userSelFramework not found');
    consoleLogSpy.mockRestore();
  });

  it('should fetch framework categories object from CSL and set it in local storage', () => {
    const selectedFramework = 'mockFramework';
    const setFwCatObjConfigFromCslMock = jest.spyOn(service, 'setFwCatObjConfigFromCsl');
    service.fetchFWCatObjFromCsl(selectedFramework);
    expect(setFwCatObjConfigFromCslMock).toHaveBeenCalledWith(selectedFramework);
    expect(setFwCatObjConfigFromCslMock).toHaveBeenCalledTimes(2);
  });

  it('should transform user-defined framework category based on user preference', () => {
    const userDefinedFwCategory = [
      { code: 'category1', label: 'Category 1' },
      { code: 'category2', label: 'Category 2' },
    ];
    const userPreference = {
      framework: {
        category1: ['Value1', 'Value2'],
      },
    };
    const transformedArray = service.frameworkLabelTransform(userDefinedFwCategory, userPreference);
    expect(transformedArray).toHaveLength(1);
    expect(transformedArray[0]).toEqual({
      labels: 'Category 1',
      values: ['Value1', 'Value2'],
    });
  });

  it('should set framework based on channel data if userSelFramework is not provided', () => {
    const channelDataMock = {
      result: {
        channel: {
          defaultFramework: 'channelDefaultFramework'
        }
      }

    };
    (channelServiceMock.getFrameWork as any).mockReturnValueOnce(of(channelDataMock));
    const setFWCatConfigFromCslSpy = jest.spyOn(service, 'setFWCatConfigFromCsl');
    service.setDefaultFWforCsl(undefined, 'someChannelId');
    expect(channelServiceMock.getFrameWork).toHaveBeenCalledWith('someChannelId');
    expect(setFWCatConfigFromCslSpy).toHaveBeenCalledWith('channelDefaultFramework');
  });

  it('should reject the Promise when fetching framework configuration fails', async () => {
    const errorMock = new Error('Mocked error');
    jest.spyOn(csFrameworkServiceMock, 'getFrameworkConfigMap').mockReturnValueOnce(throwError(errorMock));

    try {
      await service.setFWCatConfigFromCsl('userSelectedFramework');
      fail('The Promise should have been rejected');
    } catch (error) {
      expect(error).toEqual(errorMock);
    }
    expect(csFrameworkServiceMock.getFrameworkConfigMap).toHaveBeenCalledWith('userSelectedFramework', {
      apiPath: '/api/framework/v1'
    });
  });

  it('should resolve the Promise when fetching framework configuration is successful', async () => {
    const fwDataMock = { exampleProperty: 'exampleValue' };
    jest.spyOn(csFrameworkServiceMock, 'getFrameworkConfigMap').mockReturnValueOnce(of(fwDataMock));
    const setFwCatObjConfigFromCslSpy = jest.spyOn(service, 'setFwCatObjConfigFromCsl');
    await service.setFWCatConfigFromCsl('userSelectedFramework');

    expect(csFrameworkServiceMock.getFrameworkConfigMap).toHaveBeenCalledTimes(3);
    expect(csFrameworkServiceMock.getFrameworkConfigMap).toHaveBeenCalledWith('userSelectedFramework', {
      apiPath: '/api/framework/v1'
    });
    expect(setFwCatObjConfigFromCslSpy).toHaveBeenCalledWith('userSelectedFramework');
    expect(localStorage.getItem('fwCategoryObject')).toBe(JSON.stringify(fwDataMock));
  });

  it('should parse the string into an object if it is not null or undefined', () => {
    const testObject = { key: 'value' };
    localStorage.setItem('fwCategoryObject', JSON.stringify(testObject));
    const result = service.getFrameworkCategories();
    expect(result).toEqual(testObject);
  });

  it('should parse the string into an object if it is not null or undefined', () => {
    const testObject = { key: 'value' };
    localStorage.setItem('fwCategoryObjectValues', JSON.stringify(testObject));
    const result = service.getFrameworkCategoriesObject();
    expect(result).toEqual(testObject);
  });

  it('should handle error when fetching framework configuration fails', () => {
    const userSelFramework = 'mockedFramework';
    const errorMock = new Error('Mocked error');
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(csFrameworkServiceMock, 'getFrameworkConfig').mockReturnValueOnce(throwError(errorMock));
    service.setFwCatObjConfigFromCsl(userSelFramework);
    expect(consoleErrorSpy).toHaveBeenCalledWith('getFrameworkConfig failed', errorMock);
    consoleErrorSpy.mockRestore();
  });

  it('should handle form details retrieval with success', (done) => {
    const formConfigMock = { code: 'persona1', name: 'Persona 1' };
    const rootOrgIdMock = 'mockRootOrgId';
    (mockFormService.getFormConfig as jest.Mock).mockReturnValue(of(formConfigMock));
    service['getFormDetails'](rootOrgIdMock).subscribe((result) => {
      expect(result).toEqual(formConfigMock);
      done();
    });
  });

  it('should handle form details retrieval with error', (done) => {
    const errorMock = new Error('Form config retrieval failed');
    const fwCategoryObjectStringMock = { key: 'value' };
    const rootOrgIdMock = 'mockRootOrgId';
    (mockFormService.getFormConfig as jest.Mock).mockReturnValue(throwError(errorMock));
    service['getFormDetails'](rootOrgIdMock).subscribe((result) => {
      expect(result).toEqual(fwCategoryObjectStringMock);
      done();
    });
  });

  it('should transform framework categories data correctly', () => {
    const frameworkCategoriesObject = [
      { code: '1', label: 'Category 1', placeHolder: 'Select Option 1' },
      { code: '2', label: 'Category 2', placeHolder: 'Select Option 2' },
    ];

    const frameworkCategories = {
      fwCategory1: { code: '1' },
    };
    const transformedData = service.transformPageLevelFilter(frameworkCategoriesObject, frameworkCategories);
    expect(transformedData).toHaveLength(frameworkCategoriesObject.length);

    transformedData.forEach((transformData, index) => {
      const originalData = frameworkCategoriesObject[index];
      expect(transformData.category).toBe(originalData.code);
      expect(transformData.labelText).toBe(originalData.label);
      expect(transformData.placeholderText).toBe(originalData.placeHolder);
      expect(transformData.dataSource).toBe('framework');
    });
  });

  it('should return null for getGlobalFilterCategories when no data in local storage', () => {
    const result = service.getGlobalFilterCategories();
    expect(result).toBeNull();
  });

  it('should return global filter categories object for getGlobalFilterCategories when data in local storage', () => {
    const mockCategoriesObject = { category1: 'value1', category2: 'value2' };
    localStorage.setItem('globalFilterObject', JSON.stringify(mockCategoriesObject));
    const result = service.getGlobalFilterCategories();
    expect(result).toEqual(mockCategoriesObject);
  });

  it('should return null for getGlobalFilterCategoriesObject when no data in local storage', () => {
    const result = service.getGlobalFilterCategoriesObject();
    expect(result).toBeNull();
  });

  it('should return global filter categories object for getGlobalFilterCategoriesObject when data in local storage', () => {
    const mockCategoriesObject = [{ index: 1, code: 'category1', label: 'Category 1' }];
    localStorage.setItem('globalFilterObjectValues', JSON.stringify(mockCategoriesObject));
    const result = service.getGlobalFilterCategoriesObject();
    expect(result).toEqual(mockCategoriesObject);
  });

  it('should handle missing framework categories gracefully', () => {
    jest.spyOn(service, 'getFrameworkCategories').mockReturnValue(null);
    const result = service.getAllFwCatName();
    expect(result).toEqual([]);
  });

  it('should return an array of framework category names', () => {
    jest.spyOn(service, 'getFrameworkCategories').mockReturnValue({
      fwCategory1: { code: 'Category1' },
      fwCategory2: { code: 'Category2' },
      fwCategory3: { code: 'Category3' },
      fwCategory4: { code: 'Category4' },
    });
    const result = service.getAllFwCatName();
    expect(result).toEqual(['Category1', 'Category2', 'Category3', 'Category4']);
  });

  it('should transform data for Common Consumption (CC)', () => {
    jest.spyOn(service, 'getGlobalFilterCategoriesObject').mockReturnValue([
      { code: 'filter1', type: 'filter', index: 1, label: 'Filter 1' },
      { code: 'filter2', type: 'other', index: 2, label: 'Filter 2' },
    ]);
    const result = service.transformDataForCC();
    expect(result).toEqual([
      { code: 'organisation', name: 'Publisher' },
      { index: 2, code: 'filter2', alternativeCode: 'filter2', label: 'Filter 2' },
    ]);
  });

  it('should handle missing global filter data gracefully', () => {
    jest.spyOn(service, 'getGlobalFilterCategoriesObject').mockReturnValue(null);
    const result = service.transformDataForCC();
    expect(result).toEqual([{ code: 'organisation', name: 'Publisher' }]);
  });

  it('should return alternative codes for framework filter categories', () => {
    const mockGlobalFilterCategories = {
      fwCategory1: { type: 'framework', alternativeCode: 'code1' },
      fwCategory2: { type: 'framework', alternativeCode: 'code2' },
      fwCategory3: { type: 'other', alternativeCode: 'code3' },
    };
    jest.spyOn(service, 'getGlobalFilterCategories').mockReturnValue(mockGlobalFilterCategories);
    const result = service.getAlternativeCodeForFilter();
    expect(result).toEqual(['code1', 'code2']);
  });

  it('should return an empty array if there are no framework filter categories', () => {
    jest.spyOn(service, 'getGlobalFilterCategories').mockReturnValue(null);
    const result = service.getAlternativeCodeForFilter();
    expect(result).toEqual([]);
  });

  it('should set transformed global filter configuration when form details are available', () => {
    jest.spyOn(service, 'getFormDetails' as any).mockReturnValue(of([{ title: 'frmelmnts.tab.all', metaData: { globalFilterConfig: [{}] } }]));
    service.setTransFormGlobalFilterConfig();
    expect(localStorage.getItem('globalFilterObject')).not.toBeNull();
    expect(localStorage.getItem('globalFilterObjectValues')).not.toBeNull();
  });

  it('should set default global filter configuration when form details are not available', () => {
    jest.spyOn(service, 'getFormDetails' as any).mockReturnValue(of([]));
    service.setTransFormGlobalFilterConfig();
    expect(localStorage.getItem('globalFilterObject')).not.toBeNull();
    expect(localStorage.getItem('globalFilterObjectValues')).not.toBeNull();
  });

  it('should transform content data based on framework category data', () => {
    const fwCatData = [
      { code: 'category1', alternativeCode: 'altCode1', type: 'filter', label: 'Label1', index: 1 },
      { code: 'category2', alternativeCode: 'altCode2', type: 'non-filter', label: 'Label2', index: 2 },
    ];

    const contentData = {
      altCode1: 'Value1',
      altCode2: 'Value2',
    };
    const result = service.transformContentDataFwBased(fwCatData, contentData);
    expect(result).toEqual([
      { labels: 'Label2', value: 'Value2', index: 2 },
    ]);
  });

  it('should handle missing content data gracefully', () => {
    const fwCatData = [
      { code: 'category1', alternativeCode: 'altCode1', type: 'filter', label: 'Label1', index: 1 },
      { code: 'category2', alternativeCode: 'altCode2', type: 'non-filter', label: 'Label2', index: 2 },
    ];

    const contentData = {};
    const result = service.transformContentDataFwBased(fwCatData, contentData);
    expect(result).toEqual([]);
  });

  it('should return an empty object if obj1 is empty', () => {
    const obj1 = {};
    const obj2 = [{ code: 'key1' }, { code: 'key2' }];
    const result = service.transformSelectedData(obj1, obj2);
    expect(result).toEqual({});
  });

  it('should return an empty object if obj1 is undefined', () => {
    const obj1 = undefined;
    const obj2 = [{ code: 'key1' }, { code: 'key2' }];
    const result = service.transformSelectedData(obj1, obj2);
    expect(result).toEqual({});
  });

  it('should filter keys from obj1 based on obj2', () => {
    const obj1 = { key1: 'value1', key2: 'value2', key3: 'value3' };
    const obj2 = [{ code: 'key1' }, { code: 'key3' }];
    const result = service.transformSelectedData(obj1, obj2);
    expect(result).toEqual({ key1: 'value1', key3: 'value3' });
  });

  it('should return an empty object if obj2 has no codes', () => {
    const obj1 = { key1: 'value1', key2: 'value2' };
    const obj2 = [];
    const result = service.transformSelectedData(obj1, obj2);
    expect(result).toEqual({});
  });

});
