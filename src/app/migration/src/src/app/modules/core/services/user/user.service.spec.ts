import { LearnerService } from './../learner/learner.service';
import { ConfigService } from './../config/config.service';
import { TestBed, inject } from '@angular/core/testing';

import { UserService } from './user.service';

describe('userService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService, ConfigService, LearnerService]
    });
  });

  it('should be created', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});
