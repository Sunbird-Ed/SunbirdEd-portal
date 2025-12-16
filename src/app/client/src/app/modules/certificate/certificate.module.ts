import { SharedFeatureModule } from '@sunbird/shared-feature';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CertificateRoutingModule } from './certificate-routing.module';
import { SuiModalModule, SuiSelectModule, SuiDropdownModule, SuiPopupModule } from '@project-sunbird/ng2-semantic-ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { CertificateConfigurationComponent, CertificateDetailsComponent, CreateTemplateComponent, SvgEditorComponent } from './components';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { BrowseImagePopupComponent } from './components/browse-image-popup/browse-image-popup.component';
// import { SvgEditorModule } from 'ng-svg-editor';
import { CsModule } from '@project-sunbird/client-services';
import { CsLibInitializerService } from '../../service/CsLibInitializer/cs-lib-initializer.service';

export const csCertificateServiceFactory = (csLibInitializerService: CsLibInitializerService) => {
  if (!CsModule.instance.isInitialised) {
    csLibInitializerService.initializeCs();
  }
  return CsModule.instance.certificateService;
};

@NgModule({
  declarations: [
    CertificateDetailsComponent,
    CertificateConfigurationComponent,
    CreateTemplateComponent,
    SvgEditorComponent,
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
  ],
  providers: [{ provide: 'CS_CERTIFICATE_SERVICE', useFactory: csCertificateServiceFactory, deps: [CsLibInitializerService] }]
})
export class CertificateModule { }
