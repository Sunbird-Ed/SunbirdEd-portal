import { CsLibInitializerService } from './cs-lib-initializer.service';
import { UserService } from '@sunbird/core';
import { CsModule } from '@project-fmps/client-services';
import { of } from 'rxjs';

describe('CsLibInitializerService', () => {
    let csLibInitializerService: CsLibInitializerService;
    const mockUserService: Partial<UserService> = {
        userData$: of({
            userProfile: {} as any
        }) as any,
        appId: '123',
    };
    beforeEach(() => {
        csLibInitializerService = new CsLibInitializerService(
            mockUserService as UserService)
    });

    it('should create CsLibInitializerService', () => {
        expect(csLibInitializerService).toBeTruthy();
    });

    it('should initialize CsModule', () => {
        jest.spyOn(document, 'getElementById').mockReturnValue(<HTMLElement><unknown>123)
        CsModule.instance['_isInitialised'] = false;
        jest.spyOn(CsModule.instance, 'init');
        csLibInitializerService.initializeCs();
        expect(CsModule.instance.init).toHaveBeenCalled();
        expect(CsModule.instance.isInitialised).toBeTruthy();

    });
});