import { TestBed, inject } from '@angular/core/testing';
import { Router } from '@angular/router';

import { RouterNavigationService } from './router-navigation.service';

xdescribe('RouterNavigationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RouterNavigationService, Router]
    });
  });

  it('should be created', inject([RouterNavigationService], (service: RouterNavigationService) => {
    expect(service).toBeTruthy();
  }));
});
