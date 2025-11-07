import { HelpRoutingModule } from './help-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqComponent, OfflineHelpVideosComponent } from './components';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { FaqReportComponent } from './components/faq-report/faq-report.component';
import { CommonFormElementsModule } from '@project-sunbird/common-form-elements-full';
import { SuiModalModule } from '@project-sunbird/ng2-semantic-ui';
import { SunbirdVideoPlayerModule } from '@project-sunbird/sunbird-video-player-v9';

@NgModule({
  imports: [
    CommonModule,
    TelemetryModule,
    CoreModule,
    SharedModule,
    HelpRoutingModule,
    CommonConsumptionModule,
    CommonFormElementsModule,
    SuiModalModule,
    SunbirdVideoPlayerModule
  ],
  declarations: [FaqComponent, OfflineHelpVideosComponent, FaqReportComponent],
  exports: [FaqComponent, OfflineHelpVideosComponent, FaqReportComponent],
})
export class HelpModule { }
