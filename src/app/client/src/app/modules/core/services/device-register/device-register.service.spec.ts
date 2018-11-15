import { TestBed, inject } from '@angular/core/testing';
import { CoreModule, DeviceRegisterService } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DeviceRegisterService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, CoreModule.forRoot(), SharedModule.forRoot()],
        });
    });

    it('should be created', inject([DeviceRegisterService], (service: DeviceRegisterService) => {
        expect(service).toBeTruthy();
    }));
});
