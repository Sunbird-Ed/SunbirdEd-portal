import { TestBed } from '@angular/core/testing';

import { RecaptchaService } from './recaptcha.service';

describe('RecaptchaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RecaptchaService = TestBed.get(RecaptchaService);
    expect(service).toBeTruthy();
  });
});
