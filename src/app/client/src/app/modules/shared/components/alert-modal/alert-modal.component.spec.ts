import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ResourceService } from '../../services';
import { AlertModalComponent } from './alert-modal.component';
import { metaData } from './alert-modal.component.spec.data';
import * as _ from 'lodash-es';

describe("AlertModalComponent", () => {
  let component: AlertModalComponent;
  const mockLocation: Partial<Location> = {
    back: jest.fn()
  };
  const mockDialogRef: Partial<MatDialogRef<AlertModalComponent>> = {
    close: jest.fn()
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

  beforeAll(() => {
    component = new AlertModalComponent(
      mockDialogRef as MatDialogRef<AlertModalComponent>,
      metaData,
      mockLocation as Location,
      mockResourceService as ResourceService
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance of AlertModalComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call getMethod with cancel data', () => {
    const data = {
      type: 'cancel',
      returnValue: 'abcd'
    };
    component.getMethod(data);
    expect(mockDialogRef.close).toHaveBeenCalledWith({ returnValue: 'abcd', action: 'cancel' });
  });

  it('should call getMethod with approve data', () => {
    const data = {
      type: 'save',
      returnValue: 'abcd'
    };
    component.getMethod(data);
    expect(mockDialogRef.close).toHaveBeenCalledWith({ returnValue: 'abcd', action: 'approve' });
  });

  it('should call navigatePrevious', () => {
    const data = {
      footer: {
        buttons: [{
          returnValue: 'abcd'
        }]
      }
    };
    component.navigatePrevious(data);
    expect(mockDialogRef.close).toHaveBeenCalledWith({ returnValue: false, action: 'deny' });
    expect(mockLocation.back).toHaveBeenCalled();
  });
});
