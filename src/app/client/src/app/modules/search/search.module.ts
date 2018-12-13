import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { SearchRoutingModule } from './search-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserSearchService } from './services';
import { OrderModule } from 'ngx-order-pipe';
import { CourseSearchComponent, UserFilterComponent, UserEditComponent, UserDeleteComponent, HomeSearchComponent, HomeFilterComponent,
   OrgSearchComponent, OrgFilterComponent, UserProfileComponent, UserSearchComponent, LibrarySearchComponent } from './components';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';
import { CatalogComponent } from './components/catalog/catalog.component';
import { CatalogFiltersComponent } from './components/catalog-filters/catalog-filters.component';

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
    ReactiveFormsModule,
  ],
  declarations: [ UserSearchComponent, CourseSearchComponent, LibrarySearchComponent,
  UserFilterComponent, UserEditComponent, UserDeleteComponent, OrgSearchComponent, OrgFilterComponent,
   UserProfileComponent, HomeSearchComponent, HomeFilterComponent, CatalogComponent, CatalogFiltersComponent],
  providers: [UserSearchService]
})
export class SearchModule { }
