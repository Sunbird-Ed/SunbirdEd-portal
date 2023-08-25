import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { SearchRoutingModule } from './search-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSearchService } from './services';
import { UserFilterComponent, UserEditComponent, UserDeleteComponent, HomeSearchComponent,
   UserProfileComponent, UserSearchComponent } from './components';
import { TelemetryModule } from '@sunbird/telemetry';
import {SharedFeatureModule} from '@sunbird/shared-feature';
// import { Angular2CsvModule } from 'angular2-csv'; Angular2CsvModule removed TODO: use Blob object to generate csv file
// import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { ContentSearchModule } from '@sunbird/content-search';
import { TranslateModule } from '@ngx-translate/core';
import { CommonConsumptionModule } from 'compass-common-consumption';
import { CardModule } from 'compass-common-consumption';

@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule,
    TranslateModule,
    SharedModule,
    SuiModule,
    FormsModule,
    CoreModule,
    TelemetryModule,
    SharedFeatureModule,
    ReactiveFormsModule,
    CommonConsumptionModule,
    ContentSearchModule,
    CardModule
  ],
  declarations: [ UserSearchComponent,
  UserFilterComponent, UserEditComponent, UserDeleteComponent,
  UserProfileComponent, HomeSearchComponent ],
  providers: [UserSearchService]
})
export class SearchModule { }
