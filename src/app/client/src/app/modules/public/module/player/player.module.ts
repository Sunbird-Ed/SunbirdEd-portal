import { PlayerRoutingModule } from './player-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicCollectionPlayerComponent, PublicContentPlayerComponent } from './components';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule } from '@sunbird/shared';
import { BadgingModule } from '@sunbird/badge';
import { CoreModule } from '@sunbird/core';
import { PlayerHelperModule } from '@sunbird/player-helper';

@NgModule({
    imports: [
        CommonModule,
        PlayerRoutingModule,
        TelemetryModule,
        SharedModule,
        BadgingModule,
        CoreModule,
        PlayerHelperModule
    ],
    providers: [],
    declarations: [PublicCollectionPlayerComponent, PublicContentPlayerComponent]
})
export class PlayerModule { }
