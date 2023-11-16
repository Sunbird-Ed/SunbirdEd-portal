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

});
