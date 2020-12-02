import { TestBed } from '@angular/core/testing';
import { ConfigService } from '@sunbird/shared';
import { DiscussionsService } from './discussions.service';
import {HttpClientModule} from '@angular/common/http';

describe('DiscussionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientModule],
    providers: [ConfigService]
  }));

  it('should be created', () => {
    const service: DiscussionsService = TestBed.get(DiscussionsService);
    expect(service).toBeTruthy();
  });
});
