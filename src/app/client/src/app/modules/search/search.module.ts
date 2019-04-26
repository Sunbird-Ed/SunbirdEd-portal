import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { SearchRoutingModule } from './search-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSearchService } from './services';
import { OrderModule } from 'ngx-order-pipe';
import { CourseSearchComponent, UserFilterComponent, UserEditComponent, UserDeleteComponent, HomeSearchComponent,
  OrgSearchComponent, OrgFilterComponent, UserProfileComponent, UserSearchComponent, LibrarySearchComponent } from './components';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { AvatarModule } from 'ngx-avatar';
import {SharedFeatureModule} from '@sunbird/shared-feature';
// import { Angular2CsvModule } from 'angular2-csv'; Angular2CsvModule removed TODO: use Blob object to generate csv file

@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule,
    SharedModule,
    SuiModule,
    FormsModule,
    CoreModule,
    OrderModule,
    TelemetryModule,
    NgInviewModule,
    AvatarModule,
    SharedFeatureModule,
    ReactiveFormsModule
  ],
  declarations: [ UserSearchComponent, CourseSearchComponent, LibrarySearchComponent,
  UserFilterComponent, UserEditComponent, UserDeleteComponent, OrgSearchComponent, OrgFilterComponent,
  UserProfileComponent, HomeSearchComponent ],
  providers: [UserSearchService]
})
export class SearchModule { }
