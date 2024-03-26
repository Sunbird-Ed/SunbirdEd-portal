import { PlayerRoutingModule } from './player-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule } from '@sunbird/shared';
import { BadgingModule } from '@sunbird/badge';
import { CoreModule } from '@sunbird/core';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { SuiModule } from '@project-sunbird/ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { CommonConsumptionModule} from '@project-sunbird/common-consumption';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { PendingchangesGuard } from '@sunbird/public';

@NgModule({
    imports: [
        CommonModule,
        SuiModule,
        PlayerRoutingModule,
        TelemetryModule,
        FormsModule,
        SharedModule,
        BadgingModule,
        CoreModule,
        PlayerHelperModule,
        CommonConsumptionModule,
        SharedFeatureModule
    ],
    providers: [ PendingchangesGuard ],
    declarations: []
})
export class PlayerModule { }
