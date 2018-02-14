import { EventService } from './event.service';
import { UserService } from './user.service';
import { TelemetryService } from './telemetry.service';
import { Injectable } from '@angular/core';
@Injectable()
export class FrameworkApiService {
    constructor(
        private userService: UserService
    ) { }
    public getService(serviceId: string) {
        switch (serviceId) {
            case "eventService":
            // return this.eventService;
            case "userService":
                return this.userService;
            case "telemetryService":
            // return this.telemetryService;
        }
    }
}

