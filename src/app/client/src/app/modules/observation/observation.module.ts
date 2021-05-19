import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObservationRoutingModule } from './observation-routing.module';
import { ObservationListingComponent } from './components/observation-listing/observation-listing.component';
import { ObservationDetailsComponent } from './components/observation-details/observation-details.component';
import { MlGuard } from './guards';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { AvatarModule } from 'ngx-avatar';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { ContentSearchModule } from '@sunbird/content-search';
import { TranslateModule } from '@ngx-translate/core';
import { LocationModule } from '../../plugins/location/location.module';
import { ObservationUtilService } from './service';
@NgModule({
  declarations: [ObservationListingComponent, ObservationDetailsComponent],
  imports: [
    CommonModule,
    ObservationRoutingModule,
    TranslateModule,
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
  providers: [MlGuard,ObservationUtilService]

})
export class ObservationModule { }
