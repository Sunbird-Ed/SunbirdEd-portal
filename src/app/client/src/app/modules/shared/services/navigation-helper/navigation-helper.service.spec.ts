import { TestBed, inject } from '@angular/core/testing';

import { NavigationHelperService } from './navigation-helper.service';

describe('NavigationHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavigationHelperService]
    });
  });

  it('should be created', inject([NavigationHelperService], (service: NavigationHelperService) => {
    expect(service).toBeTruthy();
  }));
});
