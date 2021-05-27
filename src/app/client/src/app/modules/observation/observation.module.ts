import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule, SuiModalModule, SuiSelectModule, SuiAccordionModule, SuiPopupModule, SuiDimmerModule, SuiTabsModule, SuiDropdownModule, SuiProgressModule, SuiRatingModule, SuiCollapseModule} from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObservationRoutingModule } from './observation-routing.module';
import { MlGuard } from './guards';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { AvatarModule } from 'ngx-avatar';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { ContentSearchModule } from '@sunbird/content-search';
import { TranslateModule } from '@ngx-translate/core';
import {
  AddEntityComponent, SubmissionsComponent, ObservationListingComponent, ObservationDetailsComponent,
  EntityListComponent, EditSubmissionComponent
} from './components';
import { LocationModule } from '../../plugins/location/location.module';
import { ObservationUtilService } from './service';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';
@NgModule({
  declarations: [ObservationListingComponent, ObservationDetailsComponent, AddEntityComponent, SubmissionsComponent,
    EntityListComponent,AlertModalComponent, EditSubmissionComponent],
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
    AvatarModule,
    NgInviewModule,
    TelemetryModule,
    SuiModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    CoreModule,
    SharedFeatureModule,
    LocationModule
  ],
  providers: [MlGuard,ObservationUtilService],
  entryComponents: [AlertModalComponent]

})
export class ObservationModule { }
