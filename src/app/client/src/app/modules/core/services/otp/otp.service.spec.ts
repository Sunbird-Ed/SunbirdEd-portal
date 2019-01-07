import { ConfigService} from '@sunbird/shared';
import { TestBed, inject } from '@angular/core/testing';
import { LearnerService } from './../learner/learner.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OtpService } from './otp.service';

describe('OtpService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ConfigService, LearnerService]
    });
  });

  it('should be created', inject([OtpService], (service: OtpService) => {
    expect(service).toBeTruthy();
  }));
});
