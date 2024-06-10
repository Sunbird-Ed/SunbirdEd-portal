
/**
* Description.
* This spec file was created using ng-test-barrel plugin!
*
*/

import { ResourceService, NavigationHelperService, LayoutService } from '@sunbird/shared';
import { Router, ActivatedRoute } from '@angular/router';
import { _ } from 'lodash-es';
import { GetComponent } from './get.component';
import { of } from 'rxjs';

describe('GetComponent', () => {
    let component: GetComponent;

    const resourceService: Partial<ResourceService> = {};
    const router: Partial<Router> = {
        navigate: jest.fn()

    };
    const activatedRoute: Partial<ActivatedRoute> = {
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
    const navigationhelperService: Partial<NavigationHelperService> = {
        getPageLoadTime :jest.fn()
    };
    const layoutService: Partial<LayoutService> = {
        initlayoutConfig: jest.fn(),
        switchableLayout: jest.fn(),

    };

    beforeAll(() => {
        component = new GetComponent(
            resourceService as ResourceService,
            router as Router,
            activatedRoute as ActivatedRoute,
            navigationhelperService as NavigationHelperService,
            layoutService as LayoutService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should call ngOnInit', () => {
        Object.defineProperty(window, 'EkTelemetry', { value: { config: {} } });
        layoutService.switchableLayout = jest.fn(() => of([{ data: '' }]));
        component.ngOnInit()
        expect(layoutService.switchableLayout).toHaveBeenCalled();
    });

    it('should set values on ngAfterViewInit',(done) =>{
		component.ngAfterViewInit();
        setTimeout(() => {
			expect(component.telemetryImpression).toEqual({
				context: {
					env: activatedRoute.snapshot.data.telemetry.env
				},
				edata: {
					type: activatedRoute.snapshot.data.telemetry.type,
					pageid: activatedRoute.snapshot.data.telemetry.pageid,
					uri: activatedRoute.snapshot.data.telemetry.uri,
					duration: navigationhelperService.getPageLoadTime()
				}
			});
			done()
		});
	});

    it('should call ngOnInit', () => {
        component.searchKeyword='test'
        component.navigateToSearch()
        expect(router.navigate).toHaveBeenCalled();

    });

    it('should unsubscribe from subscriptions on destroy', () => {
        const mockResourceDataSubscription = {
            unsubscribe: jest.fn(),
        };
        component.unsubscribe$ = {
            next: jest.fn(),
            complete: jest.fn()
        } as any;

        component.ngOnDestroy();
        expect(component.unsubscribe$.next).toHaveBeenCalled();
    });
});