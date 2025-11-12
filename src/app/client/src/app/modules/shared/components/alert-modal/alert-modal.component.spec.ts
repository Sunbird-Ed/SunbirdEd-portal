
import { SuiModal } from '@project-sunbird/ng2-semantic-ui';
import { Location, LocationStrategy } from '@angular/common';
import { ResourceService } from '../../services';
import * as _ from 'lodash-es';
import { AlertModalComponent, AlertModal } from './alert-modal.component'

interface IAlertModalContext {
  data: any;
}

describe("Alert-Modal Component", () => {
  let component: AlertModalComponent;
  const mockLocation: Partial<Location> = {
    back: jest.fn()
  };
  const mockModal: Partial<SuiModal<IAlertModalContext, void>> = {
    deny:jest.fn(),
    approve:jest.fn()
  };
  const mockResourceService: Partial<ResourceService> = {
    frmelmnts: {
      lbl: {
        Select: 'Select'
      },
      cert: {
        lbl: {
          preview: 'preview',
          certAddSuccess: 'Certificate added successfully',
          certUpdateSuccess: 'Certificate updated successfully.',
          certAddError: 'Failed to add the certificate. Try again later.',
          certEditError: 'Failed to edit the certificate. Try again later.'
        }
      }
    },
    messages: {
      emsg: {
        m0005: 'Something went wrong, try again later'
      }
    }
  };
  const mockLocationStratergy: Partial<LocationStrategy> = {
    onPopState: jest.fn() as any
  }
  beforeAll(() => {
    component = new AlertModalComponent(
      mockModal as SuiModal<IAlertModalContext, void>,
      mockLocation as Location,
      mockResourceService as ResourceService,
      mockLocationStratergy as LocationStrategy
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should be create a instance of Alert-Modal Component', () => {
    expect(component).toBeTruthy();
  });
  it('should be create a instance and call the getMethod method with the data', () => {
    let data = {
      type: 'cancel',
      returnValue:'abcd'
    }
    jest.spyOn(component.modal,'deny');
    component.getMethod(data);
    expect(component.modal.deny).toBeCalled();
  });
  it('should be create a instance and call the getMethod method with the data with save ', () => {
    let data = {
      type: 'save',
      returnValue:'abcd'
    }
    jest.spyOn(component.modal,'approve');
    component.getMethod(data);
    expect(component.modal.approve).toBeCalled();
  });
  it('should be create a instance and call the navigatePrevious method with the data', () => {
    let data = {
      footer: {
        buttons:[{
          returnValue: 'abcd'
        }]
      }
    }
    jest.spyOn(component.modal,'deny');
    component.navigatePrevious(data);
    expect(component.modal.deny).toBeCalled();
  });
  describe("Alert-Modal inner Component", () => {
    let alertModelComponent : AlertModal;
    let mockData = {
      size:'mini'
    } as any;
    beforeAll(() => {
      alertModelComponent = new AlertModal(
        mockData
      );
    });
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should be create a instance of Alert-Modal inner mini Component', () => {
      expect(alertModelComponent).toBeTruthy();
    });
  });
  describe("Alert-Modal inner mini Component", () => {
    let alertModelComponent : AlertModal;
    let mockData = {
      size:'tiny'
    } as any;
    beforeAll(() => {
      alertModelComponent = new AlertModal(
        mockData
      );
    });
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should be create a instance of Alert-Modal inner tiny Component', () => {
      expect(alertModelComponent).toBeTruthy();
    });
  });
  describe("Alert-Modal inner tiny Component", () => {
    let alertModelComponent : AlertModal;
    let mockData = {
      size:'tiny'
    } as any;
    beforeAll(() => {
      alertModelComponent = new AlertModal(
        mockData
      );
    });
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should be create a instance of Alert-Modal inner tiny Component', () => {
      expect(alertModelComponent).toBeTruthy();
    });
  });
  describe("Alert-Modal inner small Component", () => {
    let alertModelComponent : AlertModal;
    let mockData = {
      size:'small'
    } as any;
    beforeAll(() => {
      alertModelComponent = new AlertModal(
        mockData
      );
    });
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should be create a instance of Alert-Modal inner small Component', () => {
      expect(alertModelComponent).toBeTruthy();
    });
  });
  describe("Alert-Modal inner normal Component", () => {
    let alertModelComponent : AlertModal;
    let mockData = {
      size:'normal'
    } as any;
    beforeAll(() => {
      alertModelComponent = new AlertModal(
        mockData
      );
    });
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should be create a instance of Alert-Modal inner normal Component', () => {
      expect(alertModelComponent).toBeTruthy();
    });
  });
  describe("Alert-Modal inner large Component", () => {
    let alertModelComponent : AlertModal;
    let mockData = {
      size:'large'
    } as any;
    beforeAll(() => {
      alertModelComponent = new AlertModal(
        mockData
      );
    });
    beforeEach(() => {
      jest.clearAllMocks();
    });
    it('should be create a instance of Alert-Modal inner large Component', () => {
      expect(alertModelComponent).toBeTruthy();
    });
  });
});