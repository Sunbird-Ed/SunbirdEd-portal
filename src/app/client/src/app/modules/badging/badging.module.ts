import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from '@project-sunbird/ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { ContentBadgeComponent, AssignBadgesContentComponent } from './components';
import { ContentBadgeService } from './services';
import { TelemetryModule } from '@sunbird/telemetry';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    imports: [
        CommonModule,
        SuiModule,
        SharedModule.forRoot(),
        TelemetryModule,
        MatTooltipModule
    ],
    declarations: [ContentBadgeComponent, AssignBadgesContentComponent],
    exports: [ContentBadgeComponent, AssignBadgesContentComponent],
    providers: [ContentBadgeService]
})
export class BadgingModule {

}
