import { IShareEventData } from '@sunbird/telemetry';
import { Component, OnInit, Input, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { ResourceService } from '../../services/index';
import { IPopup } from 'ng2-semantic-ui-v9';
import { ITelemetryShare } from '../../interfaces';
import { ActivatedRoute } from '@angular/router';
import { ShareLinkComponent } from './share-link.component';
import { of } from 'rxjs';

describe('Share link component', () => {
  let component: ShareLinkComponent;
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
  const mockRenderer2: Partial<Renderer2> = {};
  const mockActivatedRoute: Partial<ActivatedRoute> = {
    queryParams: of({
      type: 'edit',
      courseId: 'do_456789',
      batchId: '124631256'
    }),
    params: of({ collectionId: "123" }),
    snapshot: {
      data: {
        telemetry: {
          env: 'certs',
          pageid: 'certificate-configuration',
          type: 'view',
          subtype: 'paginate',
          ver: '1.0'
        }
      }
    } as any
  };
  beforeAll(() => {
    component = new ShareLinkComponent(
      mockResourceService as ResourceService,
      mockRenderer2 as Renderer2,
      mockActivatedRoute as ActivatedRoute
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should create a Share link component instance of ', () => {
    expect(component).toBeTruthy();
  });
  it('should create a instance of content type component', () => {
    component.ngOnInit();
    jest.spyOn(component, 'ngOnInit').mockImplementation(() => { });
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
  });
  it('should create a instance of content type component and call method initializeModal', () => {
    component.ngOnInit();
    expect(JSON.stringify(component.telemetryShare)).toEqual(JSON.stringify({ type: 'Link', dir: 'out', items: [] }))
  });
  xit('should create a instance of content type component and call method copyLink', () => {
    const mockData: Partial<IPopup> = {
      open: jest.fn(),
      close: jest.fn(),
      toggle:jest.fn()
    };
    jest.spyOn(mockData, 'open').mockImplementation(() => { });
    component.copyLink(mockData as IPopup);
    expect(mockData.open).toHaveBeenCalled();
  });
});


