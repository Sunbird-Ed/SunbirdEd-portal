import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { ActionService } from './action.service';

describe('ActionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [ActionService, ConfigService, HttpClient]
    });
  });

  it('should be created', inject([ActionService], (service: ActionService) => {
    expect(service).toBeTruthy();
  }));
});
