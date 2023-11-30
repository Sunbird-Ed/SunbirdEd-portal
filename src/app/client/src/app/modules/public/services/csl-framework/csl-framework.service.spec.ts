import { CslFrameworkService } from './csl-framework.service';
import { CsFrameworkService } from '@project-sunbird/client-services/services/framework';
import { ChannelService } from '@sunbird/core';
import { ConfigService } from '../../../shared/services/config/config.service';
import _ from 'lodash';
import { of ,throwError} from 'rxjs';
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
        defaultFW: 'someDefaultFramework'
      }
    }
  };

  const mockFormService: Partial<FormService> = {};

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
    expect(setFWCatConfigFromCslSpy).toHaveBeenCalledWith('someDefaultFramework');
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
      apiPath: '/api/framework/v1/'
    });
  });

  it('should resolve the Promise when fetching framework configuration is successful', async () => {
    const fwDataMock = { exampleProperty: 'exampleValue' };
    jest.spyOn(csFrameworkServiceMock, 'getFrameworkConfigMap').mockReturnValueOnce(of(fwDataMock));
    const setFwCatObjConfigFromCslSpy = jest.spyOn(service, 'setFwCatObjConfigFromCsl');
    await service.setFWCatConfigFromCsl('userSelectedFramework');

    expect(csFrameworkServiceMock.getFrameworkConfigMap).toHaveBeenCalledTimes(3);
    expect(csFrameworkServiceMock.getFrameworkConfigMap).toHaveBeenCalledWith('userSelectedFramework', {
      apiPath: '/api/framework/v1/'
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

});
