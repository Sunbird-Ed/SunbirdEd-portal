import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {RecaptchaService} from './recaptcha.service';
import {of} from 'rxjs';
import {ConfigService} from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';

// Old One
xdescribe('RecaptchaService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    providers: [HttpClient, ConfigService],
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: RecaptchaService = TestBed.inject(RecaptchaService);
    const http = TestBed.inject(HttpClient);
    const configService = TestBed.inject(ConfigService);
    spyOn(http, 'get').and.returnValue(of({result: '123'}));
    expect(service).toBeTruthy();
  });
});
