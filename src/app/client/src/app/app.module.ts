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
import { DiscussionModule } from '@sunbird/discussion';
import * as $ from 'jquery';

// portal-extensions
import { BootstrapFramework, WebExtensionModule } from 'sunbird-web-extension';
import { WebExtensionsConfig } from './framework.config';
import { BadgingModule } from '@sunbird/badge';
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SuiModule,
    CommunityModule,
    SharedModule,
    HomeModule,
    DashboardModule,
    AnnouncementModule,
    Ng2IziToastModule,
    NotesModule,
    ResourceModule,
    LearnModule,
    WorkspaceModule,
    OrgManagementModule,
    PublicModule,
    SearchModule,
    DiscussionModule,
    WebExtensionModule,
    BadgingModule,
    ...WebExtensionsConfig.plugins.map((data) => data.module)
  ],
  providers: [],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(bootstrapFramework: BootstrapFramework) {
    bootstrapFramework.initialize(WebExtensionsConfig);
  }
}
