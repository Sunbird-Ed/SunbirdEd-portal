import { AppLandingSectionComponent } from './app-landing-section.component';
import { LayoutService, ResourceService } from '../../services';
import { of } from 'rxjs';

xdescribe('AppLandingSectionComponent', () => {
    let component: AppLandingSectionComponent;
    const resourceService: Partial<ResourceService> = {
        resourceBundle: {
            'messages': {
                'fmsg': {},
                'emsg': {},
                'stmsg': {}
            }
        }
    } as any;
    const layoutService: Partial<LayoutService> = {
        redoLayoutCSS: jest.fn(),
        switchableLayout: jest.fn()
    };

    beforeAll(() => {
        component = new AppLandingSectionComponent(
            layoutService as LayoutService,
            resourceService as ResourceService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should create', () => {
        component.redoLayout();
        expect(component).toBeTruthy();
    });

    xdescribe("redoLayout", () => {
        it('should redo layout on render for threeToNine column', () => {
            component.layoutConfiguration = {};
            layoutService.initlayoutConfig = jest.fn(() => { });
            layoutService.redoLayoutCSS = jest.fn(() => {
                return 'sb-g-col-xs-9';
            });
            component.redoLayout();
            expect(component.FIRST_PANEL_LAYOUT).toEqual('sb-g-col-xs-9');
        });
        it('should redo layout on render for fullLayout column', () => {
            component.layoutConfiguration = null;
            layoutService.initlayoutConfig = jest.fn(() => { });
            layoutService.redoLayoutCSS = jest.fn(() => {
                return 'sb-g-col-xs-12';
            });
            component.redoLayout();
            expect(component.FIRST_PANEL_LAYOUT).toEqual('sb-g-col-xs-12');
        });
    });
    xdescribe('initLayout', () => {
        it('should call init Layout', () => {
            layoutService.switchableLayout = jest.fn(() => of([{ data: '' }]));
            component.initLayout();
            layoutService.switchableLayout().subscribe(layoutConfig => {
                expect(layoutConfig).toBeDefined();
            });
        });
    });

    it('should unsubscribe from all observable subscriptions', () => {
        layoutService.switchableLayout = jest.fn(() => of([{ data: '' }]));
        component.ngOnInit();
        jest.spyOn(component.unsubscribe$, 'complete');
        jest.spyOn(component.unsubscribe$, 'next');
        component.ngOnDestroy();
        expect(component.unsubscribe$.complete).toHaveBeenCalled();
        expect(component.unsubscribe$.next).toHaveBeenCalled();
    });
});
