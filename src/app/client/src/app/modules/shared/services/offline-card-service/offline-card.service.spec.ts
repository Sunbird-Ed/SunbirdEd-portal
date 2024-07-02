import { Injectable } from '@angular/core';
import { _ } from 'lodash-es';
import { OfflineCardService } from './offline-card.service';

describe('OfflineCardService', () => {
    let offlineCardService: OfflineCardService;

    beforeEach(() => {
       offlineCardService = new OfflineCardService();
    });

    it('should create an instance of OfflineCardService', () => {
        expect(offlineCardService).toBeTruthy();
    });

    describe('isYoutubeContent', () => {
        it('should return true if content is YouTube video', () => {
            const content = {
              metaData: {
                mimeType: 'video/youtube',
              },
              mimeTypesCount: '{"video/youtube": 1}',
            };
            expect(offlineCardService.isYoutubeContent(content)).toBe(true);
        });
        
        it('should return true if content is YouTube video using x-youtube mimeType', () => {
            const content = {
              metaData: {
                mimeType: 'video/x-youtube',
              },
              mimeTypesCount: '{"video/x-youtube": 1}',
            };
            expect(offlineCardService.isYoutubeContent(content)).toBe(true);
        });

        it('should return true if content has "video/youtube" in mimeTypesCount', () => {
            const content = {
              metaData: {
                mimeType: 'video/mp4',
              },
              mimeTypesCount: '{"video/youtube": 1}',
            };
            expect(offlineCardService.isYoutubeContent(content)).toBe(true);
        });

        it('should return true if content has "video/x-youtube" in mimeTypesCount', () => {
            const content = {
              metaData: {
                mimeType: 'video/mp4',
              },
              mimeTypesCount: '{"video/x-youtube": 1}',
            };
            expect(offlineCardService.isYoutubeContent(content)).toBe(true);
        });

        it('should return false if content is not YouTube video', () => {
            const content = {
              metaData: {
                mimeType: 'video/mp4',
              },
              mimeTypesCount: '{"video/mp4": 1}',
            };
            expect(offlineCardService.isYoutubeContent(content)).toBe(false);
        });
        
        it('should return true if content has no mimeType', () => {
            const content = {
              metaData: {},
              mimeTypesCount: '{"video/youtube": 1}',
            };
            expect(offlineCardService.isYoutubeContent(content)).toBe(true);
        });
        
        it('should return false if content has no mimeTypesCount', () => {
            const content = {
              metaData: {
                mimeType: 'video/youtube',
              },
            };
            expect(offlineCardService.isYoutubeContent(content)).toBe(true);
        });

        it('should return false if mimeTypesCount is not valid JSON', () => {
            const content = {
              metaData: {
                mimeType: 'video/youtube',
              },
              mimeTypesCount: 'invalid-json',
            };
            expect(offlineCardService.isYoutubeContent(content)).toBe(true);
        });
    });
});