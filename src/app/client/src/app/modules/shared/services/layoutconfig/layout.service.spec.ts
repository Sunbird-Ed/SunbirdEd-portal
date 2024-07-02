import { _ } from 'lodash-es';
import { ConfigService } from '../config/config.service';
import { LayoutService } from './layout.service';

describe('RouterNavigationService', () => {
    let layoutService : LayoutService;
    const mockConfigService: Partial<ConfigService> = {
        appConfig: {
            layoutConfiguration: 'mock-configuration',
        },
    };

    beforeAll(() => {
       layoutService = new LayoutService(
        mockConfigService as ConfigService,
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of component', () => {
        expect(layoutService).toBeTruthy();
    });
    
    describe('initlayoutConfig',()=> { 
        it('should initialize layout configuration from config service', () => {
            const result = layoutService.initlayoutConfig();
            expect(result).toEqual(mockConfigService.appConfig.layoutConfiguration);
        });

        it('should return the layoutconfig', () => {
            layoutService.layoutConfig = 'mock-layout-config'
            const result = layoutService.initlayoutConfig();
            expect(result).toEqual('mock-layout-config');
        });
    });

    it('should return the layoutconfig on calling getLayoutConfig',()=>{
      const result = layoutService.getLayoutConfig();
      expect(result).toEqual('mock-layout-config');
    });
    
    it('should set layout configuration and emit it through BehaviorSubject', () => {
        const mockLayoutConfig = { layout: 'mock-layout'};
        const spyNext = jest.spyOn(layoutService['_layout$'], 'next');
        layoutService.setLayoutConfig(mockLayoutConfig);
    
        expect(layoutService.layoutConfig).toEqual(mockLayoutConfig);
        expect(spyNext).toHaveBeenCalledWith({ layout: mockLayoutConfig });
    });
    
    it('should return layoutConfigData$',()=>{
       const result =layoutService.switchableLayout();
       expect(layoutService._layoutConfigData$).toBeDefined();
       expect(result).toEqual(layoutService._layoutConfigData$);
    });

    describe('redoLayoutCSS',()=>{
        describe('should generate CSS classes for filter layout with layoutConfigExternal is either not present or true',()=>{
            const panelIndex = 0;
            const layoutConfigExternal = true;
            const columnType = {panelIndex: 'mock-result-layout'};
            
            it('should call redoLayoutFilterCSS method when isFilterLayout is true', () => {
                jest.spyOn(layoutService,'redoLayoutFilterCSS');
                const result = layoutService.redoLayoutCSS(panelIndex, layoutConfigExternal, columnType, true);
                
                expect(layoutService.redoLayoutFilterCSS).toHaveBeenCalled();
            });

            it('should generate CSS classes for filter layout with layoutConfigExternal true', () => {
                jest.spyOn(layoutService,'redoLayoutFilterCSS');
                const result = layoutService.redoLayoutCSS(panelIndex, layoutConfigExternal, columnType);
                
                expect(result).toEqual('sb-g-col-xs-12 sb-g-col-md-undefined sb-g-col-lg-undefined sb-g-col-xxxl-4');
            });
        })
        
        describe('should generate CSS classes for filter layout with layoutConfigExternal false', () => {
            it('should generate CSS classes for filter layout with columnType not equal to total', () => {
                const panelIndex = 1;
                const layoutConfigExternal = false;
                const columnType = [10,12];
            
                const result = layoutService.redoLayoutCSS(panelIndex, layoutConfigExternal, columnType);
            
                expect(result).toEqual('sb-g-col-xs-12 sb-g-col-md-12 sb-g-col-lg-12 sb-g-col-xxxl-12');
            });  

            it('should generate CSS classes for filter layout with columnType equal to total', () => {
                const panelIndex = 1;
                const layoutConfigExternal = false;
                const columnType = [12,10];
            
                const result = layoutService.redoLayoutCSS(panelIndex, layoutConfigExternal, columnType);
            
                expect(result).toEqual('sb-g-col-xs-12 sb-g-col-md-12 sb-g-col-lg-12 sb-g-col-xxxl-16');
            });  
        });
    });

    describe('isLayoutAvailable',()=>{
      it('should return true when layoutConfigExternal is present',()=>{
        const result = layoutService.isLayoutAvailable('mock-external-layout');
        expect(result).toBeTruthy();
      });

      it('should return true when layoutConfigExternal is null',()=>{
        const result = layoutService.isLayoutAvailable(null);
        expect(result).toBeFalsy();
      });
    });
    

    it('should switch layout configuration from mock to base when layoutConfig is present', () => {
        layoutService.layoutConfig = mockConfigService.appConfig.layoutConfiguration;
        layoutService.acessibleLayoutEnabled = true;
        jest.spyOn(layoutService,'setLayoutConfig')
        layoutService.initiateSwitchLayout();
    
        expect(layoutService.layoutConfig).toBeNull();
        expect(document.documentElement.getAttribute('layout')).toEqual('base');
        expect(layoutService.acessibleLayoutEnabled).toBeFalsy();
        expect(localStorage.getItem('layoutType')).toEqual('default');
        expect(layoutService.setLayoutConfig).toHaveBeenCalled();
    });

    it('should switch layout configuration from moxk to joy when layoutConfig is not present', () => {
        layoutService.layoutConfig =  null;
        jest.spyOn(layoutService,'setLayoutConfig')
        layoutService.initiateSwitchLayout();
    
        expect(layoutService.layoutConfig).toEqual(mockConfigService.appConfig.layoutConfiguration);
        expect(document.documentElement.getAttribute('layout')).toEqual('joy');
        expect(localStorage.getItem('layoutType')).toEqual('joy');
        expect(layoutService.setLayoutConfig).toHaveBeenCalled();
    });
    
    it('should call scrollTop method',()=>{
      window.scroll = jest.fn() as any;
      layoutService.scrollTop();

      expect(window.scroll).toHaveBeenCalledWith(
        {
          top: 0,
          left: 0,
          behavior: 'smooth'
        }
      );
    });

});