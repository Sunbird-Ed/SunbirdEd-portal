import {
    CanDeactivateGuard,
    ComponentDeactivate,
} from './can-deactivate.guard';
import { ResourceService } from '../../shared';

xdescribe('CanDeactivateGuard', () => {
    let canDeactivateGuard: CanDeactivateGuard;
    const mockComponent: ComponentDeactivate = {
        canDeactivate: jest.fn(),
        unloadNotification: jest.fn()
    };
    const mockRsourceService: Partial<ResourceService> = {
        frmelmnts: {
            lbl: {
                confirmBackClick: 'Confirm',
            },
        }
    };

    beforeEach(() => {
        canDeactivateGuard = new CanDeactivateGuard(
            mockRsourceService as ResourceService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('expect service to instantiate', () => {
        window.confirm = jest.fn(() => Promise.resolve(true)) as any
        expect(canDeactivateGuard).toBeTruthy();
        expect(canDeactivateGuard.canDeactivate(mockComponent)).toBeTruthy
    });

    it('expect guard to return true', () => {
        window.confirm = jest.fn(() => undefined) as any
        expect(canDeactivateGuard.canDeactivate(mockComponent)).toBeFalsy()
    });

    it('expect guard to return false', () => {
        mockComponent.canDeactivate = jest.fn(() => Promise.resolve(true)) as any
        mockComponent.unloadNotification({});
        expect(canDeactivateGuard.canDeactivate(mockComponent)).toBeTruthy();
    });

});
