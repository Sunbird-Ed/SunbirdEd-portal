import { TestBed, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConfigService } from '@sunbird/shared';
import { configureTestSuite } from '@sunbird/test-util';
// import { KendraService } from './kendra.service';
import { CloudService} from './cloud.service'
describe('CloudService', () => {
  configureTestSuite();
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [CloudService, ConfigService, HttpClient]
    });
  });

  it('should be created', inject([CloudService], (service: CloudService) => {
    expect(service).toBeTruthy();
  }));
});
