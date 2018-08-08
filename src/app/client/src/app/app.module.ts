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
import { BootstrapFramework, WebExtensionModule } from 'sunbird-web-extension';
import { WebExtensionsConfig, PluginModules } from './framework.config';
import { CacheService } from 'ng2-cache-service';
import { CacheStorageAbstract } from 'ng2-cache-service/dist/src/services/storage/cache-storage-abstract.service';
import { CacheSessionStorage } from 'ng2-cache-service/dist/src/services/storage/session-storage/cache-session-storage.service';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule.forRoot(),
    CommonModule,
    BrowserModule,
    HttpClientModule,
    SuiModule,
    SharedModule.forRoot(),
    Ng2IziToastModule,
    WebExtensionModule.forRoot(),
    // ...WebExtensionsConfig.plugins.map((data) => data.module),
    TelemetryModule.forRoot(),
    PublicModule,
    ...PluginModules,
    AppRoutingModule // don't add any module below this because it is having wildcard route
  ],
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
