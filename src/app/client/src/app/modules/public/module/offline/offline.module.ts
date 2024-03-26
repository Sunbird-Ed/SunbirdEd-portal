import { ContentManagerService } from './services';
import {
    SuiModalModule, SuiProgressModule, SuiAccordionModule,
    SuiTabsModule, SuiSelectModule, SuiDimmerModule, SuiCollapseModule, SuiDropdownModule
} from '@project-sunbird/ng2-semantic-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { OfflineRoutingModule } from './offline-routing.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import {
    LibraryComponent, ContentManagerComponent, ContentManagerInfoPopUpComponent,
    LoadContentComponent, InfoCardComponent, TelemetryComponent, TelemetryImportComponent,
    AboutUsComponent
} from './components';
import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { NgxFilesizeModule } from 'ngx-filesize';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { ContentSearchModule } from '@sunbird/content-search';
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        CoreModule,
        SharedModule,
        OfflineRoutingModule,
        SuiModalModule,
        SuiProgressModule,
        SuiSelectModule,
        WebExtensionModule,
        NgxFilesizeModule,
        SuiAccordionModule,
        SuiTabsModule,
        ReactiveFormsModule,
        CommonConsumptionModule,
        SuiDimmerModule,
        SuiCollapseModule,
        SuiDropdownModule,
        ContentSearchModule,
    ],
    providers: [DeviceDetectorService, ContentManagerService],
    declarations: [
        LibraryComponent,
        LoadContentComponent,
        InfoCardComponent,
        TelemetryComponent,
        TelemetryImportComponent,
        ContentManagerInfoPopUpComponent,
        ContentManagerComponent,
        AboutUsComponent
    ],
    exports: [InfoCardComponent]
})
export class OfflineModule { }
