import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { _ } from 'lodash-es';
import { OnDemandReportService } from './on-demand-report.service';
import { of } from 'rxjs';

describe('OnDemandReportService', () => {
  let onDemandReportService: OnDemandReportService;
  let mockHttpClient: HttpClient;
  let mockConfig: ConfigService;

  beforeEach(() => {
    mockHttpClient = {
      get: jest.fn(),
      post: jest.fn(),
    } as unknown as HttpClient;

    mockConfig = {
        urlConFig: {
          URLS: {
            REPORT_PREFIX: 'your_report_prefix',
            REPORT: {
              DATASET_LIST: 'your_dataset_list_url',
              COLLECTION: 'your_collection_url',
              SUMMARY: {
              PREFIX: 'your_summary_prefix_url',
              },
            },
          },
        },
      } as ConfigService;  
    onDemandReportService = new OnDemandReportService(mockHttpClient, mockConfig);
  });

  it('should create an instance of OnDemandReportService', () => {
    expect(onDemandReportService).toBeTruthy();
  });

  describe('getReportList', () => {
    it('should make an HTTP GET request to retrieve report list', () => {
      const tag = 'exampleTag';
      const expectedUrl = 'your_report_prefixyour_dataset_list_url/exampleTag';
      const mockResponse = [{ report: 'data' }];

      (mockHttpClient.get as jest.Mock).mockImplementation(() => of(mockResponse));

      onDemandReportService.getReportList(tag);

      expect(mockHttpClient.get).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
    });
  });

  describe('getReport', () => {
    it('should make an HTTP GET request to retrieve a report', () => {
      const tag = 'exampleTag';
      const requestId = 'exampleRequestId';
      const expectedUrl = 'your_report_prefixundefined/exampleTag?requestId=exampleRequestId';
      const mockResponse = { report: 'data' };

      (mockHttpClient.get as jest.Mock).mockImplementation(() => of(mockResponse));

      onDemandReportService.getReport(tag, requestId);

      expect(mockHttpClient.get).toHaveBeenCalledWith(expectedUrl, expect.any(Object));
    });
  });
  
  describe('submitRequest', () => {
    it('should make an HTTP POST request to submit a report request', () => {
      const request = { data: 'exampleData' };
      const expectedUrl = 'your_report_prefixundefined';
      const mockResponse = { success: true };

      (mockHttpClient.post as jest.Mock).mockImplementation(() => of(mockResponse));

      onDemandReportService.submitRequest(request);

      expect(mockHttpClient.post).toHaveBeenCalledWith(expectedUrl, request, expect.any(Object));
    });
  });

  describe('getSummeryReports', () => {
    it('should make an HTTP POST request with the correct URL and options', () => {
      const request = { data: 'exampleData' };
      const expectedUrl = 'your_report_prefix/v1your_collection_urlyour_summary_prefix_url';
      const mockResponse = { success: true };

      (mockHttpClient.post as jest.Mock).mockReturnValue(of(mockResponse));

      onDemandReportService.getSummeryReports(request);

      expect(mockHttpClient.post).toHaveBeenCalledWith(expectedUrl, request, {
        headers: { 'Content-Type': 'application/json' },
      });
    });
  });

  describe('isInProgress', () => {
    it('should return true when report status is "submitted"', () => {
      const reportListData = { status: 'submitted' };
      const reportStatus = { submitted: 'submitted', processing: 'processing' };
      const result = onDemandReportService.isInProgress(reportListData, reportStatus);
      expect(result).toBe(true);
    });

    it('should return true when report status is "processing"', () => {
      const reportListData = { status: 'processing' };
      const reportStatus = { submitted: 'submitted', processing: 'processing' };
      const result = onDemandReportService.isInProgress(reportListData, reportStatus);
      expect(result).toBe(true);
    });

    it('should return false when report status is neither "submitted" nor "processing"', () => {
      const reportListData = { status: 'completed' };
      const reportStatus = { submitted: 'submitted', processing: 'processing' };
      const result = onDemandReportService.isInProgress(reportListData, reportStatus);
      expect(result).toBe(false);
    });
  });
  
  describe('canRequestReport', () => {
    it('should return true when submittedDate is not greater than batchEndDate', () => {
      const submittedDate = new Date('2023-01-01');
      const batchEndDate = new Date('2023-12-31');
      const result = onDemandReportService.canRequestReport(submittedDate, batchEndDate);
      expect(result).toBe(true);
    });

    it('should return false when submittedDate is greater than batchEndDate', () => {
      const submittedDate = new Date('2023-12-31');
      const batchEndDate = new Date('2023-01-01');
      const result = onDemandReportService.canRequestReport(submittedDate, batchEndDate);
      expect(result).toBe(false);
    });

    it('should return true when batchEndDate is not provided', () => {
      const submittedDate = new Date('2023-01-01');
      const result = onDemandReportService.canRequestReport(submittedDate, null);
      expect(result).toBe(true);
    });
  });
});