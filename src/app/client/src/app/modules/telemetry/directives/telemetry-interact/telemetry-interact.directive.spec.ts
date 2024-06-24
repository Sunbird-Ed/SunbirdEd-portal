
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { Directive,Input,HostListener } from '@angular/core';
import { IInteractEventInput,IInteractEventObject,IInteractEventEdata,IProducerData } from '../../interfaces';
import { TelemetryService } from '../../services';
import { ActivatedRoute,Router } from '@angular/router';
import * as _ from 'lodash-es';
import { of } from 'rxjs';
import {TelemetryInteractDirective} from './telemetry-interact.directive'

describe('TelemetryInteractDirective', () => {
    let component: TelemetryInteractDirective;

    const telemetryService :Partial<TelemetryService> ={
        interact:jest.fn()
    };
	const activatedRoute :Partial<ActivatedRoute> ={
        snapshot: {
            firstChild:{data: {
                telemetry: {
                  env: 'certs',
                  pageid: 'certificate-configuration',
                  type: 'view',
                  subtype: 'paginate',
                  ver: '1.0'
                }
            }},
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
	const router :Partial<Router> ={};

    beforeAll(() => {
        component = new TelemetryInteractDirective(
            telemetryService as TelemetryService,
			activatedRoute as ActivatedRoute,
			router as Router
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(component).toBeTruthy();
    });
    it('should create a instance of component and call the onclick method', () => {
        const e=null;
        activatedRoute.snapshot = {
            queryParams: {
                board: ['board'],
                medium: ['medium-1'],
                gradeLevel: ['gradeLevel-1'],
                chhanel: '',
                selectedTab: 'mydownloads'
            },
            params: {
                pageNumber: 1
            }
        } as any;
        component.telemetryInteractObject ={ id: 'sample-uid', type: 'User', ver: '1.0' };
        component.telemetryInteractPdata ={id: "staging.sunbird.portal", ver: "7.0.0", pid: "sunbird-portal"}
        component.telemetryInteractEdata ={id: 'pageId', type: 'click', pageid: 'explorePage'};
        component['onClick'](e);
        expect(component.telemetryService.interact).toBeCalled();
    });
    it('should create a instance of component and call the onclick method with version as number', () => {
        const e=null;
        activatedRoute.snapshot = {
            queryParams: {
                board: ['board'],
                medium: ['medium-1'],
                gradeLevel: ['gradeLevel-1'],
                chhanel: '',
                selectedTab: 'mydownloads'
            },
            params: {
                pageNumber: 1
            }
        } as any;
        component.telemetryInteractObject ={ id: 'sample-uid', type: 'User', ver: 1 } as any;
        component.telemetryInteractPdata ={id: "staging.sunbird.portal", ver: "7.0.0", pid: "sunbird-portal"}
        component.telemetryInteractEdata ={id: 'pageId', type: 'click', pageid: 'explorePage'};
        component['onClick'](e);
        expect(component.telemetryService.interact).toBeCalled();
    });
});