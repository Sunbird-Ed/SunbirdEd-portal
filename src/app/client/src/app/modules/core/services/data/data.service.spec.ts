import { RequestParam } from '@sunbird/shared';
import { of, throwError } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { DataService } from './data.service';
import { now } from 'lodash';

describe('DataService', () => {
  let dataService: DataService;
  const mockHttpClient: Partial<HttpClient> = {
    get: jest.fn().mockImplementation(() => { })
  };
  beforeAll(() => {
    dataService = new DataService(
      mockHttpClient as HttpClient,
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of dataService', () => {
    expect(dataService).toBeTruthy();
    expect(dataService.appVersion).toEqual('1.0');
  });
});
