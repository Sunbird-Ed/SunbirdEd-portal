import { SegmentationTagService } from './segmentation-tag.service';
import { FrameworkService } from '../framework/framework.service';

describe('SegmentationTagService', () => {
  let service: SegmentationTagService;
  const mockFrameworkService: Partial<FrameworkService> = {
    getSegmentationCommands: jest.fn(() => Promise.resolve([])),
  };
  let frameworkService = mockFrameworkService as any;
  service = new SegmentationTagService(frameworkService);

  beforeEach(() => {
    service = new SegmentationTagService(mockFrameworkService as FrameworkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update exeCommands based on new data', () => {
    expect(service.exeCommands).toEqual(expect.any(Array));
  });

  it('should execute a command when executeCommand is called', () => {
    const validCmdList = [
      {
          commandId: 1618943400000,
          commandType: 'SEGMENT_COMMAND',
          controlFunction: 'LOCAL_NOTIF',
          controlFunctionPayload: [{
              id: 'payload_data'
          }],
          expiresAfter: 1619202600000,
          tagCriteria: 'AND',
          tagFilterUpto: '',
          tagFilters: ['UA_English'],
          targetDeviceIds: '',
          targetVersion: ''
      }
    ];
    service.executeCommand(validCmdList);
  });

  it('should call frameworkService.getSegmentationCommands when getSegmentCommand is called', () => {
    const getSegmentationCommandsSpy = jest.spyOn(frameworkService, 'getSegmentationCommands').mockResolvedValue([]);
    service.getSegmentCommand();
    expect(getSegmentationCommandsSpy).toHaveBeenCalled();
  });

  it('should add cmdCriteria to exeCommands when conditions are met', () => {
    const cmdCriteria = {
      commandId: '123',
      controlFunction: 'BANNER_CONFIG',
      targetedClient: 'portal',
      controlFunctionPayload: {
        showBanner: true,
      },
    };
    service.executeCommand([cmdCriteria]);
    expect(service.exeCommands).toContain(cmdCriteria);
  });

  it('should not add cmdCriteria to exeCommands when conditions are not met', () => {
    const cmdCriteria = {
      commandId: '123',
      controlFunction: 'BANNER_CONFIG',
      targetedClient: 'app',
      controlFunctionPayload: {
        showBanner: true,
      },
    };
    service.executeCommand([cmdCriteria]);
    expect(service.exeCommands).not.toContain(cmdCriteria);
  });

  it('should add cmdCriteria to exeCommands when it is not already present based on commandId', () => {

    const existingCmdCriteria = {
      commandId: '123',
      controlFunction: 'BANNER_CONFIG',
      targetedClient: 'portal',
      controlFunctionPayload: {
        showBanner: true,
      }
    };
    service.exeCommands = [existingCmdCriteria];

    const cmdCriteria = {
      commandId: '456',
      controlFunction: 'BANNER_CONFIG',
      targetedClient: 'portal',
      controlFunctionPayload: {
        showBanner: true,
      }
    };
    service.executeCommand([cmdCriteria]);
    expect(service.exeCommands).toContain(cmdCriteria);
  });

});
