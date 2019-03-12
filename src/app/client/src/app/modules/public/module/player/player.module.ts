import { PlayerRoutingModule } from './player-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicCollectionPlayerComponent, PublicContentPlayerComponent } from './components';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule } from '@sunbird/shared';
import { BadgingModule } from '@sunbird/badge';
import { CoreModule } from '@sunbird/core';
@NgModule({
    imports: [
        CommonModule,
        PlayerRoutingModule,
        TelemetryModule,
        SharedModule,
        BadgingModule,
        CoreModule
    ],
    providers: [],
    declarations: [PublicCollectionPlayerComponent, PublicContentPlayerComponent]
})
export class PlayerModule { }
