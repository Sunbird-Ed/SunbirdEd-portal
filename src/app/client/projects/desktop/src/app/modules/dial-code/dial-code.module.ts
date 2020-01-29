import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DesktopDialCodeSearchComponent } from './desktop-dial-code-search/desktop-dial-code-search.component';
import { OfflineModule } from '../offline';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { SuiDimmerModule } from 'ng2-semantic-ui';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { DialCodeRoutingModule } from './dial-code.routing.module';

@NgModule({
  declarations: [DesktopDialCodeSearchComponent],
  imports: [
    CommonModule,
    CoreModule,
    SharedModule,
    NgInviewModule,
    InfiniteScrollModule,
    OfflineModule,
    SharedFeatureModule,
    SuiDimmerModule,
    TelemetryModule,
    PlayerHelperModule,
    DialCodeRoutingModule
  ]
})
export class DialCodeModule { }
