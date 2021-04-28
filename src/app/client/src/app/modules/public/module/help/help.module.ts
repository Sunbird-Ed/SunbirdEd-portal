import { HelpRoutingModule } from './help-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqComponent, OfflineHelpVideosComponent } from './components';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { FaqReportComponent } from './components/faq-report/faq-report.component';
import { CommonFormElementsModule } from 'common-form-elements';
import { SuiModalModule } from 'ng2-semantic-ui';
import { SunbirdVideoPlayerModule } from '@project-sunbird/sunbird-video-player-v8';

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
  exports: [FaqComponent, OfflineHelpVideosComponent, FaqReportComponent]
})
export class HelpModule { }
