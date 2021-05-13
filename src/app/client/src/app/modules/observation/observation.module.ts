import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ObservationRoutingModule } from './observation-routing.module';
import { ObservationListingComponent } from './components/observation-listing/observation-listing.component';
import { ObservationDetailsComponent } from './components/observation-details/observation-details.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { AvatarModule } from 'ngx-avatar';
import {SharedFeatureModule} from '@sunbird/shared-feature';
// import { Angular2CsvModule } from 'angular2-csv'; Angular2CsvModule removed TODO: use Blob object to generate csv file
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { ContentSearchModule } from '@sunbird/content-search';
import { TranslateModule } from '@ngx-translate/core';
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
    CoreModule
  ]
})
export class ObservationModule { }
