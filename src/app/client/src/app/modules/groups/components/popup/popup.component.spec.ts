import { GroupsService } from './../../services';
import { ResourceService } from '@sunbird/shared';
import { IImpressionEventInput, TelemetryService } from '@sunbird/telemetry';
import { Router, ActivatedRoute } from '@angular/router';
import { NavigationHelperService } from '@sunbird/shared';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from './popup.component';
import { DELETE_POPUP, POP_DEACTIVATE } from '../../interfaces/telemetryConstants';

describe('Popup component', ()=>{
  let popupComponent: PopupComponent;
  const mockResourceService: Partial<ResourceService> = {
    instance:'sunbird'
  };
  const mockGroupService: Partial<GroupsService> = {
    emitMenuVisibility:jest.fn(),
    groupData: {
      id: '1'
    } as any
  };
  const mockRouter: Partial<Router> = {
    url: '/url1'
  };
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    snapshot: {
      data: {
        telemetry: {
            env: 'env1',
            type: 'type1',
            subtype: 'subtype1',
            pageid: 'pageid1'
        }
      }
    } as any
  };
  const mockTelemetryService: Partial<TelemetryService> = {
    impression: jest.fn()
  };
  const mockNavigationHelperService: Partial<NavigationHelperService> = {
    getPageLoadTime: jest.fn().mockReturnValue('1ms')
  };
  const dialogRefData = {
    close: jest.fn()
  };
  const mockMatDialog: Partial<MatDialog> = {
    getDialogById: jest.fn().mockReturnValue(dialogRefData)
  };

  beforeAll(() => {
    popupComponent = new PopupComponent(
      mockResourceService as ResourceService,
      mockGroupService as GroupsService,
      mockRouter as Router,
      mockActivatedRoute as ActivatedRoute,
      mockTelemetryService as TelemetryService,
      mockNavigationHelperService as NavigationHelperService,
      mockMatDialog as MatDialog
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should  create an instance of popupComponent and set the channel property", () => {
    expect(popupComponent).toBeTruthy();
    expect(popupComponent.channel).toBeDefined();
    expect(popupComponent.channel).toEqual('SUNBIRD');
  });

  it('should close dialog after emitting data by handleEvent', ()=> {
    popupComponent.name = 'delete';
    popupComponent.handleEvent={
      emit: jest.fn()
    } as any;
    const value = 'click';
    const argData = {
      name: 'delete',
      action: 'click'
    }
    jest.spyOn(popupComponent.handleEvent,'emit');
    //@ts-ignore
    jest.spyOn(popupComponent,'closeDialog');
    popupComponent.emitEvent(value);
    expect(popupComponent.handleEvent.emit).toBeCalledWith(argData);
    expect(popupComponent['closeDialog']).toBeCalledWith('groupsModal');
  });

  it('should handle acceptGroupTnc method', ()=> {
    popupComponent.type = 'test1' as any
    popupComponent.handleGroupTnc={
        emit: jest.fn()
    } as any
    const argData = {
        type: 'test1'
    }
    //@ts-ignore
    jest.spyOn(popupComponent,'closeDialog');
    jest.spyOn(popupComponent.handleGroupTnc,'emit');
    popupComponent.acceptGroupTnc();
    expect(popupComponent['closeDialog']).toBeCalledWith('groupTncModal');
    expect(popupComponent.handleGroupTnc.emit).toBeCalledWith(argData);
  });

  it('should close dialog and emit by handleGroupTnc on closeModal call', ()=> {
    //@ts-ignore
    jest.spyOn(popupComponent,'closeDialog');
    jest.spyOn(popupComponent.handleGroupTnc,'emit');
    popupComponent.closeModal();
    expect(popupComponent['closeDialog']).toBeCalledWith('groupTncModal');
    expect(popupComponent.handleGroupTnc.emit).toBeCalled();
  });

  it('should close dialog twice on onPopstate call', ()=> {
    //@ts-ignore
    jest.spyOn(popupComponent,'closeDialog');
    popupComponent.onPopState('');
    expect(popupComponent['closeDialog']).toBeCalledTimes(2);
    expect(popupComponent['closeDialog']).toHaveBeenNthCalledWith(1,'groupsModal');
    expect(popupComponent['closeDialog']).toHaveBeenNthCalledWith(2,'groupTncModal');
  });

  it('should close dialog on closeDialog call', ()=> {
    jest.spyOn(dialogRefData,'close');
    popupComponent['closeDialog']('groupsModal');
    expect(dialogRefData.close).toBeCalled();
  });

  describe('ngAfterViewInit', ()=>{
    it('should call setTelemetryImpression with object containing DELETE_POPUP', ()=> {
      const argData = {type:DELETE_POPUP};
      jest.spyOn(popupComponent,'setTelemetryImpression');
      popupComponent.ngAfterViewInit();
      expect(popupComponent.setTelemetryImpression).toBeCalledWith(argData);
    });

    it('should call setTelemetryImpression with object containing POP_DEACTIVATE', ()=> {
        popupComponent.name = 'deActivate'
        const argData = {type:POP_DEACTIVATE};
        jest.spyOn(popupComponent,'setTelemetryImpression');
        popupComponent.ngAfterViewInit();
        expect(popupComponent.setTelemetryImpression).toBeCalledWith(argData);
    });
  });

  describe('setTelemetryImpression', ()=> {
    const argData = {
        type: DELETE_POPUP
    };
    const responseData = {
        context: {
            env: 'env1',
            cdata: [{
              type: 'Group',
              id: '1'
            }]
          },
          edata: {
            type: 'delete-popup',
            subtype: 'subtype1',
            pageid: 'pageid1',
            uri: '/url1',
            duration: '1ms'
          }
      }
    it('should set  telemetryImpression property', ()=> {
      popupComponent.setTelemetryImpression(argData);
      expect(popupComponent.telemetryImpression).toBeDefined();
      expect(popupComponent.telemetryImpression).toEqual(responseData);
    })

    it('should set edata type of telemetryImpression property with argument value', ()=> {
       popupComponent.telemetryImpression.edata.type = '';
       popupComponent.setTelemetryImpression(argData);
       expect(popupComponent.telemetryImpression.edata.type).toEqual(argData.type);
    });

    it('should call impression on telemetryService', ()=> {
      jest.spyOn(popupComponent['telemetryService'],'impression');
      popupComponent.setTelemetryImpression(argData);
      expect(popupComponent['telemetryService'].impression).toBeCalledWith(responseData);
    })
  })
})