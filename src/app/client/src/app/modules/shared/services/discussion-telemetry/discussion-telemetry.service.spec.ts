import { TelemetryService } from '@sunbird/telemetry';
import { NavigationHelperService } from './../navigation-helper/navigation-helper.service';
import { Injectable } from '@angular/core';
import { _ } from 'lodash-es';
import { DiscussionTelemetryService } from './discussion-telemetry.service';

describe('DiscussionTelemetryService', () => {
    let discussionTelemetry: DiscussionTelemetryService;

    const mockNavigationHelperService :Partial<NavigationHelperService> ={
        getPageLoadTime: jest.fn(),
    };
	const mockTelemetryService :Partial<TelemetryService> ={
        impression: jest.fn(),
        interact: jest.fn(),
    };

    beforeAll(() => {
        discussionTelemetry = new DiscussionTelemetryService(
            mockNavigationHelperService as NavigationHelperService,
			mockTelemetryService as TelemetryService
        )
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
            
    it('should create a instance of discussionTelemtry', () => {
        expect(discussionTelemetry).toBeTruthy();
    });
    
    describe('logTelemetryEvent',()=>{ 
        it('should log IMPRESSION event', () => {
            const event = {
                eid: 'IMPRESSION',
                context: {
                    cdata: [{ mockKey: 'mock-value' }],
                    object: { mockId: 'mock-id' },
                },
                edata: { mockData: 'mock-value' },
            };
            mockNavigationHelperService.getPageLoadTime = jest.fn().mockReturnValue(1000);
            discussionTelemetry.logTelemetryEvent(event);
        
            expect(mockTelemetryService.impression).toHaveBeenCalledWith({
                context: {
                   env: 'discussion',
                   cdata: [{ mockKey: 'mock-value' }],
                },
                edata: { mockData: 'mock-value', duration: 1000 },
                object: { mockId: 'mock-id' },
            });
        });
        
        it('should log INTERACT event', () => {
            const event = {
                eid: 'INTERACT',
                context: {
                    cdata: [{ mockKey: 'mock-value' }],
                    object: { mockId: 'mock-id' },
                },
                edata: { mockData: 'mock-value' },
            };
            discussionTelemetry.logTelemetryEvent(event);
        
            expect(mockTelemetryService.interact).toHaveBeenCalledWith({
                context: {
                   env: 'discussion',
                   cdata: [{ mockKey: 'mock-value' }],
                },
                edata: { mockData: 'mock-value' },
                object: { mockId: 'mock-id' },
            });
        });
    });

    it('should set and get contextCdata', () => {
        const mockData = [{ key: 'value' }];
        discussionTelemetry.contextCdata = mockData;
        const result = discussionTelemetry.contextCdata;

        expect(result).toEqual(mockData);
    });
    
});