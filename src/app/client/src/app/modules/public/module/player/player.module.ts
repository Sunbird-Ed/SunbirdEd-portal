import { PlayerRoutingModule } from './player-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule } from '@sunbird/shared';
import { BadgingModule } from '@sunbird/badge';
import { CoreModule } from '@sunbird/core';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { SuiModalModule } from '@project-sunbird/ng2-semantic-ui';
import { CommonConsumptionModule} from '@project-sunbird/common-consumption';
import { SharedFeatureModule } from '@sunbird/shared-feature';

@NgModule({
    imports: [
        CommonModule,
        PlayerRoutingModule,
        TelemetryModule,
        SharedModule,
        BadgingModule,
        CoreModule,
        PlayerHelperModule,
        SuiModalModule,
        CommonConsumptionModule,
        SharedFeatureModule
    ],
    providers: [],
    declarations: []
})
export class PlayerModule { }
