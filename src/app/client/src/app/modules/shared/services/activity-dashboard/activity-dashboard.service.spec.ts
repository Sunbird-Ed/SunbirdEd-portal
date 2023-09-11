import { TestBed } from '@angular/core/testing';
import { truncate } from 'fs';

import { ActivityDashboardService } from './activity-dashboard.service';

describe('ActivityDashboardService', () => {
    let service: ActivityDashboardService;

    beforeEach(() => {
        service = new ActivityDashboardService();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set isActivityAdded', () => {
        service.isActivityAdded = true;
        expect(service['_isActivityAdded']).toEqual(true);
    });

    it('should get isActivityAdded', () => {
        service._isActivityAdded = true;
        expect(service['isActivityAdded']).toEqual(true);
    });
});