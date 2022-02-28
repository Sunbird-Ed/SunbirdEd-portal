import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {RecaptchaService} from './recaptcha.service';
import {of} from 'rxjs';
import {ConfigService} from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';

// service xdescribe
xdescribe('RecaptchaService', () => {
  configureTestSuite();
  beforeEach(() => TestBed.configureTestingModule({
    providers: [HttpClient, ConfigService],
    imports: [HttpClientTestingModule]
  }));

  it('should be created', () => {
    const service: RecaptchaService= <any> TestBed.inject(RecaptchaService);
    const http= <any> TestBed.inject(HttpClient);
    const configService= <any> TestBed.inject(ConfigService);
    spyOn(http, 'get').and.returnValue(of({result: '123'}));
    expect(service).toBeTruthy();
  });
});
