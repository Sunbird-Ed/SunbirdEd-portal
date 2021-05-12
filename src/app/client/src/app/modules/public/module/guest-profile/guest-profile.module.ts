import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TelemetryModule } from '@sunbird/telemetry';
import { AvatarModule } from 'ngx-avatar';
import { SharedModule } from '../../../shared/shared.module';
import { GuestProfileComponent } from './components/guest-profile/guest-profile.component';
import { GuestProfileRoutingModule } from './guest-profile-routing.module';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { LocationModule } from '../../../../plugins/location/location.module';

@NgModule({
  declarations: [GuestProfileComponent],
  imports: [
    CommonModule,
    SharedModule,
    TelemetryModule,
    AvatarModule,
    SharedFeatureModule,
    LocationModule,
    GuestProfileRoutingModule
  ]
})
export class GuestProfileModule { }
