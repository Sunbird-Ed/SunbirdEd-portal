import { PermissionDirective, BodyScrollDirective, OnlineOnlyDirective, DesktopOnlyDirective } from './directives';
import { RouterModule } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule,
  SuiProgressModule, SuiRatingModule, SuiCollapseModule
} from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { SharedModule } from '@sunbird/shared';
import { AvatarModule } from 'ngx-avatar';
import {
  MainHeaderComponent, MainFooterComponent, MainMenuComponent, SearchComponent, ErrorPageComponent,
  LanguageDropdownComponent
} from './components';
import { APP_BASE_HREF, PlatformLocation } from '@angular/common';
import { AuthGuard } from './guard/auth-gard.service';
import { CacheService } from 'ng2-cache-service';
import { WebExtensionModule } from '@project-sunbird/web-extensions';
import { TelemetryModule } from '@sunbird/telemetry';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v9';
import { ContentTypeComponent } from './components/content-type/content-type.component';
import { LocationModule } from '../../plugins/location/location.module';
import { NotificationModule } from '../notification/notification.module';
import { TelemetryErrorModalComponent } from '../shared';
import {ObservationUtilService} from '../observation/service'
@NgModule({
  imports: [
    CommonModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    WebExtensionModule,
    TelemetryModule,
    AvatarModule,
    CommonConsumptionModule,
    LocationModule,
    NotificationModule
  ],
  declarations: [MainHeaderComponent, MainFooterComponent, MainMenuComponent, SearchComponent, PermissionDirective,
    BodyScrollDirective, OnlineOnlyDirective,
    ErrorPageComponent, LanguageDropdownComponent, ContentTypeComponent, DesktopOnlyDirective, TelemetryErrorModalComponent],
  exports: [MainHeaderComponent, MainFooterComponent, PermissionDirective, BodyScrollDirective, OnlineOnlyDirective,
    TelemetryModule, LanguageDropdownComponent, DesktopOnlyDirective, TelemetryErrorModalComponent],
  providers: [CacheService, AuthGuard,ObservationUtilService, {
    provide: APP_BASE_HREF,
    useFactory: (s: PlatformLocation) => s.getBaseHrefFromDOM(),
    deps: [PlatformLocation]
  }]
})
export class CoreModule {
}
