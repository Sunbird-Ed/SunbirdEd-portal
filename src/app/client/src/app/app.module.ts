import { BrowserModule } from '@angular/platform-browser';
import { NotesModule } from '@sunbird/notes';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { SuiModule } from 'ng2-semantic-ui';
import { CommonModule } from '@angular/common';
import { CommunityModule } from '@sunbird/community';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { HomeModule } from '@sunbird/home';
import { DashboardModule } from '@sunbird/dashboard';
import { AnnouncementModule } from '@sunbird/announcement';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { ResourceModule } from '@sunbird/resource';
import { LearnModule } from '@sunbird/learn';
import { WorkspaceModule } from '@sunbird/workspace';
import { OrgManagementModule } from '@sunbird/org-management';
import { PublicModule } from '@sunbird/public';
import { SearchModule } from '@sunbird/search';
// import { DiscussionModule } from '@sunbird/discussion';
import {TelemetryModule} from '@sunbird/telemetry';
import * as $ from 'jquery';


// portal-extensions
import { BootstrapFramework, WebExtensionModule } from 'sunbird-web-extension';
import { WebExtensionsConfig, PluginModules } from './framework.config';
import { BadgingModule } from '@sunbird/badge';
import { CacheService } from 'ng2-cache-service';
import { CacheStorageAbstract } from 'ng2-cache-service/dist/src/services/storage/cache-storage-abstract.service';
import {CacheSessionStorage} from 'ng2-cache-service/dist/src/services/storage/session-storage/cache-session-storage.service';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule.forRoot(),
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SuiModule,
    // CommunityModule,
    SharedModule.forRoot(),
    HomeModule,
    DashboardModule,
    AnnouncementModule,
    Ng2IziToastModule,
    NotesModule,
    // ResourceModule, // Lazy load
    // LearnModule, // Lazy load
    // WorkspaceModule, // Lazy load
    OrgManagementModule,
    // SearchModule, // Lazy load
    // DiscussionModule,
    WebExtensionModule.forRoot(),
    BadgingModule,
    ...PluginModules,
    // ...WebExtensionsConfig.plugins.map((data) => data.module),
    TelemetryModule.forRoot(),
    PublicModule // don't any  module below this because it is having wildcard route
  ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent],
  providers: [
    CacheService,
    {provide: CacheStorageAbstract, useClass: CacheSessionStorage},
  ]
})
export class AppModule {
  constructor(bootstrapFramework: BootstrapFramework) {
    bootstrapFramework.initialize(WebExtensionsConfig);
  }
}
