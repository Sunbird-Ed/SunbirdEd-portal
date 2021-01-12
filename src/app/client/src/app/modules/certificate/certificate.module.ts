import { SharedFeatureModule } from '@sunbird/shared-feature';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateRoutingModule } from './certificate-routing.module';
import { SuiModalModule, SuiSelectModule, SuiDropdownModule, SuiPopupModule } from 'ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { CertificateConfigurationComponent, CertificateDetailsComponent, CreateTemplateComponent} from './components';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import { BrowseImagePopupComponent } from './components/browse-image-popup/browse-image-popup.component';

@NgModule({
  declarations: [
  CertificateDetailsComponent,
  CertificateConfigurationComponent,
  CreateTemplateComponent,
  BrowseImagePopupComponent
],
  imports: [
    CommonModule,
    SuiModalModule,
    CertificateRoutingModule,
    FormsModule,
    SharedModule,
    TelemetryModule,
    PlayerHelperModule,
    SuiSelectModule,
    SuiDropdownModule,
    SuiPopupModule,
    ReactiveFormsModule,
    CommonConsumptionModule,
    SharedFeatureModule
  ]
})
export class CertificateModule { }
