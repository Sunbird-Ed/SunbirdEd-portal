import { TestBed } from '@angular/core/testing';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RecoverAccountService } from './recover-account.service';

describe('RecoverAccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SharedModule.forRoot(), CoreModule],
      providers: [RecoverAccountService]
    });
  });
  it('should be created', () => {
    const service: RecoverAccountService = TestBed.get(RecoverAccountService);
    expect(service).toBeTruthy();
  });
});
