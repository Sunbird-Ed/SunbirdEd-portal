import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TelemetryService } from './telemetry.service';
import { UserService } from './../user/user.service';
import { TelemetryLibUtilService } from './telemetry-lib-util.service';
import { ConfigService } from '../../../shared';
import { LearnerService } from './../learner/learner.service';
import { Observable } from 'rxjs/Observable';
import * as mockData from './telemetry.service.spec.data';

describe('TelemetryService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TelemetryService, UserService, TelemetryLibUtilService, ConfigService,
                LearnerService]
        });
    });

    it('should be created', inject([TelemetryService], (service: TelemetryService) => {
        expect(service).toBeTruthy();
    }));
    it('should initalize telemetry', inject([TelemetryService, UserService, TelemetryLibUtilService,
        ConfigService, LearnerService], (telemetryService: TelemetryService, userService: UserService,
            telemetryLibUtilService: TelemetryLibUtilService, config: ConfigService) => {
            expect(telemetryService).toBeTruthy();
            spyOn(telemetryLibUtilService, 'initEvent').and.callFake(() => Observable.of({}));
            const apiRes = telemetryService.initialize();
            expect(telemetryLibUtilService.initEvent).toHaveBeenCalled();
        }));
    it('should start telemetry', inject([TelemetryService, UserService, TelemetryLibUtilService,
        ConfigService, LearnerService], (telemetryService: TelemetryService, userService: UserService,
            telemetryLibUtilService: TelemetryLibUtilService, config: ConfigService) => {
            spyOn(telemetryLibUtilService, 'startEvent').and.callFake(() => Observable.of({}));
            const apiRes = telemetryService.startTelemetry(mockData.mockRes.startInputData);
            expect(telemetryService).toBeTruthy();
            expect(telemetryLibUtilService.startEvent).toHaveBeenCalled();
        }));
    it('should fire impressions', inject([TelemetryService, UserService, TelemetryLibUtilService,
        ConfigService, LearnerService], (telemetryService: TelemetryService, userService: UserService,
            telemetryLibUtilService: TelemetryLibUtilService, config: ConfigService) => {
            spyOn(telemetryLibUtilService, 'impressionEvent').and.callFake(() => Observable.of({}));
            const apiRes = telemetryService.impression(mockData.mockRes.impressionInputData);
            expect(telemetryService).toBeTruthy();
            expect(telemetryLibUtilService.impressionEvent).toHaveBeenCalled();
        }));
    it('should trigger interact event', inject([TelemetryService, UserService, TelemetryLibUtilService,
        ConfigService, LearnerService], (telemetryService: TelemetryService, userService: UserService,
            telemetryLibUtilService: TelemetryLibUtilService, config: ConfigService) => {
            spyOn(telemetryLibUtilService, 'interactEvent').and.callFake(() => Observable.of({}));
            const apiRes = telemetryService.interact(mockData.mockRes.interactEventData);
            expect(telemetryService).toBeTruthy();
            expect(telemetryLibUtilService.interactEvent).toHaveBeenCalled();
        }));
    it('should trigger share event', inject([TelemetryService, UserService, TelemetryLibUtilService,
        ConfigService, LearnerService], (telemetryService: TelemetryService, userService: UserService,
            telemetryLibUtilService: TelemetryLibUtilService, config: ConfigService) => {
            spyOn(telemetryLibUtilService, 'shareEvent').and.callFake(() => Observable.of({}));
            const apiRes = telemetryService.share(mockData.mockRes.shareEventData);
            expect(telemetryService).toBeTruthy();
            expect(telemetryLibUtilService.shareEvent).toHaveBeenCalled();
        }));
    it('should trigger error event', inject([TelemetryService, UserService, TelemetryLibUtilService,
        ConfigService, LearnerService], (telemetryService: TelemetryService, userService: UserService,
            telemetryLibUtilService: TelemetryLibUtilService, config: ConfigService) => {
            spyOn(telemetryLibUtilService, 'errorEvent').and.callFake(() => Observable.of({}));
            const apiRes = telemetryService.error(mockData.mockRes.errorEventData);
            expect(telemetryService).toBeTruthy();
            expect(telemetryLibUtilService.errorEvent).toHaveBeenCalled();
        }));
    it('should end telemetry', inject([TelemetryService, UserService, TelemetryLibUtilService,
        ConfigService, LearnerService], (telemetryService: TelemetryService, userService: UserService,
            telemetryLibUtilService: TelemetryLibUtilService, config: ConfigService) => {
            spyOn(telemetryLibUtilService, 'endEvent').and.callFake(() => Observable.of({}));
            const apiRes = telemetryService.endTelemetry(mockData.mockRes.endEventData);
            expect(telemetryService).toBeTruthy();
            expect(telemetryLibUtilService.endEvent).toHaveBeenCalled();
        }));
    it('should return event object', inject([TelemetryService, UserService, TelemetryLibUtilService,
        ConfigService, LearnerService], (telemetryService: TelemetryService, userService: UserService,
            telemetryLibUtilService: TelemetryLibUtilService, config: ConfigService) => {
            const eventObjectData = telemetryService.getEventObject(mockData.mockRes.startInputData);
            expect(telemetryService).toBeTruthy();
            expect(eventObjectData.id).toEqual(mockData.mockRes.startInputData.object.id);
        }));
    it('should return context object', inject([TelemetryService, UserService, TelemetryLibUtilService,
        ConfigService, LearnerService], (telemetryService: TelemetryService, userService: UserService,
            telemetryLibUtilService: TelemetryLibUtilService, config: ConfigService) => {
            const eventContextData = telemetryService.getEventContext(mockData.mockRes.startInputData);
            expect(telemetryService).toBeTruthy();
            expect(eventContextData).toBeDefined();
        }));
    it('should return rollup details', inject([TelemetryService, UserService, TelemetryLibUtilService,
        ConfigService, LearnerService], (telemetryService: TelemetryService, userService: UserService,
            telemetryLibUtilService: TelemetryLibUtilService, config: ConfigService) => {
            const rollUpData = telemetryService.getRollUpData(['123456']);
            expect(telemetryService).toBeTruthy();
            expect(rollUpData).toEqual({ 'l1': '123456' });
        }));
    it('should return user agent details', inject([TelemetryService, UserService, TelemetryLibUtilService,
        ConfigService, LearnerService], (telemetryService: TelemetryService, userService: UserService,
            telemetryLibUtilService: TelemetryLibUtilService, config: ConfigService) => {
            const userAgent = telemetryService.getUserAgentSpec();
            expect(telemetryService).toBeTruthy();
            expect(userAgent).toBeDefined();
        }));
    it('should trigger log event', inject([TelemetryService, UserService, TelemetryLibUtilService,
        ConfigService, LearnerService], (telemetryService: TelemetryService, userService: UserService,
            telemetryLibUtilService: TelemetryLibUtilService, config: ConfigService) => {
            spyOn(telemetryLibUtilService, 'logEvent').and.callFake(() => Observable.of({}));
            const apiRes = telemetryService.logTelemetry(mockData.mockRes.logEventData);
            expect(telemetryService).toBeTruthy();
            expect(telemetryLibUtilService.logEvent).toHaveBeenCalled();
        }));

});
