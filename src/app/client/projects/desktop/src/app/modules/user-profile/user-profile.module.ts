import { OfflineModule } from './../offline/offline.module';
import { FileSizeModule } from 'ngx-filesize';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileRoutingModule } from './user-profile-routing.module';
import { ProfilePageComponent, AboutUsComponent,
  UpdateContentPreferenceComponent, UpdateLocationComponent, TelemetryComponent, TelemetryImportComponent} from './components';
import {
  SuiModalModule, SuiSelectModule
} from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProfilePageComponent,
    AboutUsComponent,
    UpdateContentPreferenceComponent,
    UpdateLocationComponent,
    TelemetryComponent,
    TelemetryImportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    UserProfileRoutingModule,
    SuiModalModule,
    SuiSelectModule,
    TelemetryModule,
    FileSizeModule,
    OfflineModule

  ]
})
export class UserProfileModule { }
