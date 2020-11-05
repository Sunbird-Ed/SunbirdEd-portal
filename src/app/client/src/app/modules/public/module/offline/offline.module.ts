import { ContentManagerService } from './services';
import {
    SuiModalModule, SuiProgressModule, SuiAccordionModule,
    SuiTabsModule, SuiSelectModule, SuiDimmerModule, SuiCollapseModule, SuiDropdownModule
} from 'ng2-semantic-ui';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { OfflineRoutingModule } from './offline-routing.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import {
    LibraryComponent, LibraryFiltersComponent,
    LoadContentComponent, NoContentComponent, ConnectionStatusComponent, InfoCardComponent
} from './components';
import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { FileSizeModule } from 'ngx-filesize';
import { OrderModule } from 'ngx-order-pipe';
import { SlickModule } from 'ngx-slick';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { NgInviewModule } from 'angular-inport';
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
        FileSizeModule,
        SuiAccordionModule,
        SuiTabsModule,
        OrderModule,
        SlickModule,
        ReactiveFormsModule,
        CommonConsumptionModule,
        SuiDimmerModule,
        NgInviewModule,
        SuiCollapseModule,
        SuiDropdownModule
    ],
    providers: [DeviceDetectorService, ContentManagerService],
    declarations: [
        LibraryComponent,
        LibraryFiltersComponent,
        ConnectionStatusComponent,
        NoContentComponent,
        LoadContentComponent,
        InfoCardComponent,
    ],
    exports: [LibraryFiltersComponent, NoContentComponent, ConnectionStatusComponent, InfoCardComponent]
})
export class OfflineModule { }
