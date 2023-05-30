import { LandingpageGuard } from './landingpage.guard';
import { Router, RouterStateSnapshot } from '@angular/router';
import { environment } from '@sunbird/environment';

describe('LandingpageGuard', () => {
    let landingpageGuard: LandingpageGuard;

    const mockRouter: Partial<Router> = {
        navigate: jest.fn(),
        url: '/downloads'
    }

    beforeAll(() => {
        landingpageGuard = new LandingpageGuard(
            mockRouter as Router
        );
    });

    it('should call landingpageGuard', () => {
        const res = landingpageGuard.canActivate(null, null);
        expect(landingpageGuard).toBeTruthy();
        expect(res).toEqual(true);
    })

    it('should call landingpageGuard on passing snapshot route', () => {
        environment.isDesktopApp = true
        const snapshotroute = {
            url: [
                {
                    path: 'test',
                }
            ],
            data: {},
            root: ''
        };
        const mock = <T, P extends keyof T>(obj: Pick<T, P>): T => obj as T;
        const state = mock<RouterStateSnapshot, "url" | "root">({
            url: '/workspace',
            root: jest.fn() as any
        });
        const result = landingpageGuard.canActivate(snapshotroute as any, state);
        expect(result).toBeFalsy();
        expect(landingpageGuard).toBeTruthy();

    })

    it('should call landingpageGuard on passing snapshot route and tenant status', () => {
        environment.isDesktopApp = false
        let mockElement = (<HTMLInputElement>document.createElement('defaultTenantIndexStatus'));
        mockElement.value = "true";
        jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);
        const snapshotroute = {
            url: [
                {
                    path: 'test',
                }
            ],
            data: {},
            root: ''
        };
        const mock = <T, P extends keyof T>(obj: Pick<T, P>): T => obj as T;
        const state = mock<RouterStateSnapshot, "url" | "root">({
            url: '/workspace',
            root: jest.fn() as any
        });
        const result = landingpageGuard.canActivate(snapshotroute as any, state);
        expect(result).toBeFalsy();
        expect(landingpageGuard).toBeTruthy();
    })
});