import { TestBed, inject } from '@angular/core/testing';
import { CoreModule, DeviceRegisterService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('DeviceRegisterService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot()],
        });
        spyOn(document, 'getElementById').and.callFake((id) => {
            if (id === 'buildNumber') {
                return { value: '1.9.0.1' };
            }
            if (id === 'deviceId') {
                return { value: 'deviceId' };
            }
            if (id === 'appId') {
                return { value: 'sunbird-portal' };
            }
            if (id === 'deviceRegisterApi') {
                return { value: 'deviceRegisterApi' };
            }
        });
    });

    it('should be created and should fetch basic details',
        inject([DeviceRegisterService, HttpClient], (deviceRegisterService: DeviceRegisterService, http: HttpClient) => {
            spyOn(http, 'post').and.callFake(() => of({}));
            deviceRegisterService.registerDevice();
            const url = 'deviceRegisterApideviceId';
            expect(http.post).toHaveBeenCalled();
    }));
});
