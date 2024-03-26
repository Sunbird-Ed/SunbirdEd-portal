import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule, SuiModalModule, SuiSelectModule, SuiAccordionModule, SuiPopupModule, SuiDimmerModule, SuiTabsModule, SuiDropdownModule, SuiProgressModule, SuiRatingModule, SuiCollapseModule} from '@project-sunbird/ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObservationRoutingModule } from './observation-routing.module';
import { MlGuard } from './guards';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { ContentSearchModule } from '@sunbird/content-search';
import { TranslateModule } from '@ngx-translate/core';
import {
  AddEntityComponent, SubmissionsComponent, ObservationListingComponent, ObservationDetailsComponent,
  EntityListComponent, EditSubmissionComponent
} from './components';
import { LocationModule } from '../../plugins/location/location.module';
import {PlayerHelperModule} from '../player-helper';

@NgModule({
  declarations: [ObservationListingComponent, ObservationDetailsComponent, AddEntityComponent, SubmissionsComponent,
    EntityListComponent, EditSubmissionComponent],
  imports: [
    CommonModule,
    ObservationRoutingModule,
    SharedModule,
    CoreModule,
    FormsModule,
    SuiModule,
    SuiSelectModule,
    SuiModalModule,
    SuiAccordionModule,
    SuiPopupModule,
    SuiDropdownModule,
    SuiProgressModule,
    SuiRatingModule,
    SuiCollapseModule,
    TranslateModule,
    SuiDimmerModule,
    SuiTabsModule,
    ContentSearchModule,
    CommonConsumptionModule,
    SharedFeatureModule,
    TelemetryModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    SharedFeatureModule,
    LocationModule,
    PlayerHelperModule
  ],
  providers: [MlGuard]

})
export class ObservationModule { }
