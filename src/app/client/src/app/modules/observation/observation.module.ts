import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ObservationRoutingModule } from './observation-routing.module';
import { ObservationListingComponent } from './components/observation-listing/observation-listing.component';
import { ObservationDetailsComponent } from './components/observation-details/observation-details.component';
import { MlGuard } from './guards';

@NgModule({
  declarations: [ObservationListingComponent, ObservationDetailsComponent],
  imports: [
    CommonModule,
    ObservationRoutingModule
  ],
  providers:[MlGuard]
})
export class ObservationModule { }
