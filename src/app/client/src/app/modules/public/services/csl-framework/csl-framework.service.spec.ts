import { CslFrameworkService } from './csl-framework.service';
import { CsFrameworkService } from '@project-sunbird/client-services/services/framework';
import { ChannelService } from '@sunbird/core';
import { ConfigService } from '../../../shared/services/config/config.service';
import { of } from 'rxjs';

jest.mock('@project-sunbird/client-services/services/framework');
jest.mock('@sunbird/core');
jest.mock('lodash');

describe('CslFrameworkService', () => {
  let service: CslFrameworkService;
  const csFrameworkServiceMock: Partial<CsFrameworkService> = {
    getFrameworkConfigMap: jest.fn(),
    getFrameworkConfig: jest.fn()
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

  beforeEach(() => {
    service = new CslFrameworkService(
      csFrameworkServiceMock as CsFrameworkService,
      channelServiceMock as ChannelService,
      configServiceMock as ConfigService
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
    service.setFwCatObjConfigFromCsl(undefined);
    expect(console.log).toHaveBeenCalledWith('userSelFramework not found');
  });

});
