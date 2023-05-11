import { AppLoaderComponent } from './app-loader.component';
import { ResourceService, ConfigService, LayoutService } from '../../../shared';

xdescribe('AppLoaderComponent', () => {
    let component: AppLoaderComponent;
    const resourceService: Partial<ResourceService> = {
        messages: {
            fmsg: {
                m0087: "Not permitted to merge account",
                m0088: "We are fetching details."
            }
        }
    };
    const layoutService: Partial<LayoutService> = {};
    const configService: Partial<ConfigService> = {
        appConfig: {
            layoutConfiguration: 'joy',
        },
        constants: {
            DEFAULT_THEME: 'joy'
        }
    };

    beforeAll(() => {
        component = new AppLoaderComponent(
            resourceService as ResourceService,
            layoutService as LayoutService,
            configService as ConfigService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call init layout on component intilization', () => {
        jest.spyOn(component, 'initLayout');
        component.ngOnInit();
        expect(component.initLayout).toHaveBeenCalled();
    });

    it('should init layout with messages', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('joy');
        component.data = {
            headerMessage: 'test',
            loaderMessage: 'test'
        }
        component.ngOnInit();
        expect(component.headerMessage).toBe(component.data.headerMessage)
        expect(component.loaderMessage).toBe(component.data.loaderMessage)
    });

    it('should init layout with messages', () => {
        jest.spyOn(Storage.prototype, 'getItem').mockReturnValue('joy');
        component.data = {};
        component.headerMessage = 'test';
        component.loaderMessage = 'test';
        component.ngOnInit();
        expect(component.headerMessage).toBeDefined();
        expect(component.loaderMessage).toBeDefined();
    });
});
