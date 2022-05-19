import { TestBed } from '@angular/core/testing';
import { CoreModule, DeviceRegisterService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { configureTestSuite } from '@sunbird/test-util';

// NEW xdescribe
xdescribe('DeviceRegisterService', () => {
    configureTestSuite();
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, CoreModule, SharedModule.forRoot()],
            providers: [DeviceRegisterService]
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

    it("Should set device id", () => {
        const deviceRS:any = TestBed.inject(DeviceRegisterService);
        deviceRS.setDeviceId()
        expect(deviceRS.deviceId).toBeDefined()
    })
});
