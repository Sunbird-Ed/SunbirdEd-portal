import { RouterNavigationService } from './router-navigation.service';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

describe('RouterNavigationService', () => {
  let routerNavigationService: RouterNavigationService;
  let mockRouter: { navigate: jest.Mock };

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn(),
    };

    routerNavigationService = new RouterNavigationService((mockRouter as unknown) as Router);
  });

  describe('navigateToParentUrl', () => {
    it('should navigate to the parent URL with queryParams', () => {
      const activatedRouteSnapshot: any = {
        parent: {
          url: [{ path: 'parent' }],
        },
        queryParams: { key: 'value' },
      };
      routerNavigationService.navigateToParentUrl(activatedRouteSnapshot);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['parent'], {
        queryParams: { key: 'value' },
      });
    });

    it('should navigate to the parent URL without queryParams', () => {
      const activatedRouteSnapshot: any = {
        parent: {
          url: [{ path: 'parent' }],
        },
        queryParams: {},
      };
      routerNavigationService.navigateToParentUrl(activatedRouteSnapshot);

      expect(mockRouter.navigate).toHaveBeenCalledWith(['parent'], { queryParams: {} });
    });
  });
});