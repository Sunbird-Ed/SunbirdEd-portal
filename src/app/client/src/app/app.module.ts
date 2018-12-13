import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { SuiModule } from 'ng2-semantic-ui';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { PublicModule } from '@sunbird/public';
import { TelemetryModule } from '@sunbird/telemetry';
import { BootstrapFramework, WebExtensionModule } from '@project-sunbird/web-extensions';
import { WebExtensionsConfig, PluginModules } from './framework.config';
import { CacheService } from 'ng2-cache-service';
import { CacheStorageAbstract } from 'ng2-cache-service/dist/src/services/storage/cache-storage-abstract.service';
import { CacheSessionStorage } from 'ng2-cache-service/dist/src/services/storage/session-storage/cache-session-storage.service';
import { DeviceDetectorModule } from 'ngx-device-detector';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CoreModule.forRoot(),
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SuiModule,
    SharedModule.forRoot(),
    Ng2IziToastModule,
    WebExtensionModule.forRoot(),
    TelemetryModule.forRoot(),
    DeviceDetectorModule.forRoot(),
    PublicModule,
    ...PluginModules,
    AppRoutingModule // don't add any module below this because it contains wildcard route
  ],
  exports: [BrowserAnimationsModule],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    CacheService,
    { provide: CacheStorageAbstract, useClass: CacheSessionStorage },
  ]
})
export class AppModule {
  constructor(bootstrapFramework: BootstrapFramework) {
    bootstrapFramework.initialize(WebExtensionsConfig);
  }
}
