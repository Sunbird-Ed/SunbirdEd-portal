import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
  SuiRatingModule, SuiCollapseModule } from 'ng2-semantic-ui';
import { CommonModule } from '@angular/common';
import { CoreModule, SessionExpiryInterceptor } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { BootstrapFramework, WebExtensionModule } from '@project-sunbird/web-extensions';
import { WebExtensionsConfig } from './framework.config';
import { CacheService } from 'ng2-cache-service';
import { CacheStorageAbstract } from 'ng2-cache-service/dist/src/services/storage/cache-storage-abstract.service';
import { CacheSessionStorage } from 'ng2-cache-service/dist/src/services/storage/session-storage/cache-session-storage.service';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { PluginModules } from './framework.config';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule, // used this instaed of browser module since it includes in it.
    CoreModule,
    CommonModule,
    HttpClientModule,
    SuiSelectModule, SuiModalModule, SuiAccordionModule, SuiPopupModule, SuiDropdownModule, SuiProgressModule,
    SuiRatingModule, SuiCollapseModule,
    SharedModule.forRoot(),
    WebExtensionModule.forRoot(),
    TelemetryModule.forRoot(),
    DeviceDetectorModule.forRoot(),
    SharedFeatureModule,
    ...PluginModules,
    AppRoutingModule // don't add any module below this because it contains wildcard route
  ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    CacheService,
    { provide: CacheStorageAbstract, useClass: CacheSessionStorage },
    // { provide: HTTP_INTERCEPTORS, useClass: SessionExpiryInterceptor, multi: true }
  ]
})
export class AppModule {
  constructor(bootstrapFramework: BootstrapFramework) {
    bootstrapFramework.initialize(WebExtensionsConfig);
  }
}
