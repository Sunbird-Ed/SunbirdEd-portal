import { DataService } from './data.service';
import { now } from 'lodash';
import { of , throwError } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { ServerResponse, RequestParam, HttpOptions } from '@sunbird/shared';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { v4 as UUID } from 'uuid';
import dayjs from 'dayjs';

jest.mock('dayjs', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('DataService', () => {
  let dataService: DataService;

  const mockHttpClient: Partial<HttpClient> = {
    get: jest.fn().mockImplementation(() => { }),
    patch: jest.fn(),
    delete: jest.fn().mockImplementation(() => { }),
    put: jest.fn().mockImplementation(() => { }),
    post: jest.fn().mockImplementation(() => { }),
  };

  beforeAll(() => {
    dataService = new DataService(
      mockHttpClient as HttpClient,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a instance of dataService', () => {
    expect(dataService).toBeTruthy();
    expect(dataService.appVersion).toEqual('1.0');
  });describe('getDateDiff', () => {
    it('should return the time difference between server date and current date', () => {
      const currentDate = new Date('2023-01-01T12:00:00Z');
      jest.spyOn(global, 'Date').mockImplementation(() => currentDate);
      const serverDate = new Date('2023-01-01T12:00:00Z');
      const timeDiff = dataService['getDateDiff'](serverDate);
      expect(timeDiff).toEqual(0);
    });

    it('should return 0 for an invalid server date', () => {
      const timeDiff = dataService['getDateDiff']('');
      expect(timeDiff).toEqual(0);
    });
  });

  describe('post', () => {
    it('should handle successful POST request', async() => {
      const mockResponse = { responseCode: 'OK', data: 'Mock data' };
      jest.spyOn(mockHttpClient, 'post').mockReturnValue(of(mockResponse));
      (dayjs as any).mockReturnValue({ format: jest.fn(() => 'formatDate') });
      await dataService.post({ url: '/mock-url', data: { key: 'value' } }).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(mockHttpClient.post).toHaveBeenCalledWith(expect.stringContaining('/mock-url'), { key: 'value' }, expect.any(Object));
      });
    });

    it('should use custom headers when provided', (done) => {
      const mockResponse = { responseCode: 'OK', data: 'Mock data' };
      jest.spyOn(mockHttpClient, 'post').mockReturnValue(of(mockResponse));
      (dayjs as any).mockReturnValue({ format: jest.fn(() => 'formatDate') });
      dataService.post({
        url: '/mock-url',
        data: { key: 'value' },
        header: { 'Custom-Header': 'custom-value' },
      }).subscribe(() => {
        expect(mockHttpClient.post).toHaveBeenCalledWith(expect.stringContaining('/mock-url'), { key: 'value' }, expect.objectContaining({
          headers: expect.objectContaining({ 'Custom-Header': 'custom-value' }),
        }));
        done();
      });
    });

    it('should return observableThrowError for failed POST request', (done) => {
      const mockErrorResponse = { responseCode: 'ERROR', data: 'Error data' };
      jest.spyOn(mockHttpClient, 'post').mockReturnValue(throwError(mockErrorResponse));
      (dayjs as any).mockReturnValue({ format: jest.fn(() => 'formatDate') });
      dataService.post({
        url: '/mock-url',
        data: { key: 'value' },
      }).subscribe({
        error: (error) => {
          expect(error).toEqual(mockErrorResponse);
          expect(mockHttpClient.post).toHaveBeenCalledWith(expect.stringContaining('/mock-url'), { key: 'value' }, expect.any(Object));
          done();
        },
      });
    });
  });

  describe('patch', () => {
    it('should handle successful PATCH request', async () => {
      const mockResponse = { responseCode: 'OK', data: 'Mock data' };
      jest.spyOn(mockHttpClient, 'patch').mockReturnValue(of(mockResponse));
      (dayjs as any).mockReturnValue({ format: jest.fn(() => 'formatDate') });
      await dataService.patch({ url: '/mock-url', data: { key: 'value' } }).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(mockHttpClient.patch).toHaveBeenCalledWith(expect.stringContaining('/mock-url'), { key: 'value' }, expect.any(Object));
      });
    });

    it('should handle error for failed PATCH request', (done) => {
      const mockErrorResponse = { responseCode: 'ERROR', data: 'Error data' };
      jest.spyOn(mockHttpClient, 'patch').mockReturnValue(throwError(mockErrorResponse));
      (dayjs as any).mockReturnValue({ format: jest.fn(() => 'formatDate') });
      dataService.patch({
        url: '/mock-url',
        data: { key: 'value' },
      }).subscribe({
        error: (error) => {
          expect(error).toEqual(mockErrorResponse);
          expect(mockHttpClient.patch).toHaveBeenCalledWith(expect.stringContaining('/mock-url'), { key: 'value' }, expect.any(Object));
          done();
        },
      });
    });
  });

  describe('delete', () => {
    it('should handle successful DELETE request', async () => {
      const mockResponse = { responseCode: 'OK', data: 'Mock data' };
      jest.spyOn(mockHttpClient, 'delete').mockReturnValue(of(mockResponse));
      (dayjs as any).mockReturnValue({ format: jest.fn(() => 'formatDate') });
      await dataService.delete({ url: '/mock-url', data: { key: 'value' } }).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(mockHttpClient.delete).toHaveBeenCalledWith(expect.stringContaining('/mock-url'), expect.any(Object));
      });
    });

    it('should handle error for failed DELETE request', (done) => {
      const mockErrorResponse = { responseCode: 'ERROR', data: 'Error data' };
      jest.spyOn(mockHttpClient, 'delete').mockReturnValue(throwError(mockErrorResponse));
      (dayjs as any).mockReturnValue({ format: jest.fn(() => 'formatDate') });
      dataService.delete({
        url: '/mock-url',
        data: { key: 'value' },
      }).subscribe({
        error: (error) => {
          expect(error).toEqual(mockErrorResponse);
          expect(mockHttpClient.delete).toHaveBeenCalledWith(expect.stringContaining('/mock-url'), expect.any(Object));
          done();
        },
      });
    });
  });

  describe('put', () => {
    it('should handle successful PUT request', async () => {
      const mockResponse = { responseCode: 'OK', data: 'Mock data' };
      jest.spyOn(mockHttpClient, 'put').mockReturnValue(of(mockResponse));
      (dayjs as any).mockReturnValue({ format: jest.fn(() => 'formatDate') });
      await dataService.put({ url: '/mock-url', data: { key: 'value' } }).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(mockHttpClient.put).toHaveBeenCalledWith(expect.stringContaining('/mock-url'), { key: 'value' }, expect.any(Object));
      });
    });

    it('should handle error for failed PUT request', (done) => {
      const mockErrorResponse = { responseCode: 'ERROR', data: 'Error data' };
      jest.spyOn(mockHttpClient, 'put').mockReturnValue(throwError(mockErrorResponse));
      (dayjs as any).mockReturnValue({ format: jest.fn(() => 'formatDate') });
      dataService.put({
        url: '/mock-url',
        data: { key: 'value' },
      }).subscribe({
        error: (error) => {
          expect(error).toEqual(mockErrorResponse);
          expect(mockHttpClient.put).toHaveBeenCalledWith(expect.stringContaining('/mock-url'), { key: 'value' }, expect.any(Object));
          done();
        },
      });
    });
  });

  describe('getWithHeaders', () => {
    it('should handle successful GET request with headers', async () => {
      const mockResponse = { responseCode: 'OK', data: 'Mock data' };
      const mockHeaders = { get: jest.fn(() => '2023-01-01T12:00:00Z') };

      jest.spyOn(mockHttpClient, 'get').mockReturnValue(of({ body: mockResponse, headers: mockHeaders }));
      jest.spyOn(dataService, 'getDateDiff' as any).mockReturnValue(0);

      await dataService.getWithHeaders({ url: '/mock-url', header: { 'Custom-Header': 'custom-value' } }).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining('/mock-url'), expect.any(Object));
        expect(dataService['getDateDiff']).toHaveBeenCalledWith('2023-01-01T12:00:00Z');
      });
    });

    it('should handle error for failed GET request with headers', (done) => {
      const mockErrorResponse = { responseCode: 'ERROR', data: 'Error data' };
      const mockHeaders = { get: jest.fn(() => '2023-01-01T12:00:00Z') };

      jest.spyOn(mockHttpClient, 'get').mockReturnValue(of({ body: mockErrorResponse, headers: mockHeaders }));
      jest.spyOn(dataService, 'getDateDiff' as any).mockReturnValue(0);

      dataService.getWithHeaders({
        url: '/mock-url',
        header: { 'Custom-Header': 'custom-value' },
      }).subscribe({
        error: (error) => {
          expect(error).toEqual(mockErrorResponse);
          expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining('/mock-url'), expect.any(Object));
          expect(dataService['getDateDiff']).toHaveBeenCalledWith('2023-01-01T12:00:00Z');
          done();
        },
      });
    });
  });

  describe('get', () => {
    it('should handle successful GET request', async () => {
      const mockResponse = { responseCode: 'OK', data: 'Mock data' };
      jest.spyOn(mockHttpClient, 'get').mockReturnValue(of(mockResponse));
      (dayjs as any).mockReturnValue({ format: jest.fn(() => 'formatDate') });
      await dataService.get({ url: '/mock-url' }).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining('/mock-url'), expect.any(Object));
      });
    });

    it('should handle error for failed GET request', (done) => {
      const mockErrorResponse = { responseCode: 'ERROR', data: 'Error data' };
      jest.spyOn(mockHttpClient, 'get').mockReturnValue(of(mockErrorResponse));
      (dayjs as any).mockReturnValue({ format: jest.fn(() => 'formatDate') });
      dataService.get({
        url: '/mock-url',
      }).subscribe({
        error: (error) => {
          expect(error).toEqual(mockErrorResponse);
          expect(mockHttpClient.get).toHaveBeenCalledWith(expect.stringContaining('/mock-url'), expect.any(Object));
          done();
        },
      });
    });
  });

  describe('postWithHeaders', () => {
    it('should handle successful POST request with headers', async () => {
      const mockResponse = { responseCode: 'OK', data: 'Mock data' };
      const mockHeaders = { get: jest.fn(() => '2023-01-01T12:00:00Z') };

      jest.spyOn(mockHttpClient, 'post').mockReturnValue(of({ body: mockResponse, headers: mockHeaders }));
      (dayjs as any).mockReturnValue({ format: jest.fn(() => 'formatDate') });
      jest.spyOn(dataService, 'getDateDiff' as any).mockReturnValue(0);

      await dataService.postWithHeaders({ url: '/mock-url', data: { key: 'value' }, header: { 'Custom-Header': 'custom-value' } }).subscribe((response) => {
        expect(response).toEqual(mockResponse);
        expect(mockHttpClient.post).toHaveBeenCalledWith(expect.stringContaining('/mock-url'), { key: 'value' }, expect.any(Object));
        expect(dataService['getDateDiff']).toHaveBeenCalledWith('2023-01-01T12:00:00Z');
      });
    });

    it('should handle error for failed POST request with headers', (done) => {
      const mockErrorResponse = { responseCode: 'ERROR', data: 'Error data' };
      const mockHeaders = { get: jest.fn(() => '2023-01-01T12:00:00Z') };

      jest.spyOn(mockHttpClient, 'post').mockReturnValue(of({ body: mockErrorResponse, headers: mockHeaders }));
      (dayjs as any).mockReturnValue({ format: jest.fn(() => 'formatDate') });
      jest.spyOn(dataService, 'getDateDiff' as any).mockReturnValue(0);

      dataService.postWithHeaders({
        url: '/mock-url',
        data: { key: 'value' },
        header: { 'Custom-Header': 'custom-value' },
      }).subscribe({
        error: (error) => {
          expect(error).toEqual(mockErrorResponse);
          expect(mockHttpClient.post).toHaveBeenCalledWith(expect.stringContaining('/mock-url'), { key: 'value' }, expect.any(Object));
          expect(dataService['getDateDiff']).toHaveBeenCalledWith('2023-01-01T12:00:00Z');
          done();
        },
      });
    });
  });

});