import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
import { SuiModule } from 'ng2-semantic-ui';
import { CommonModule } from '@angular/common';
import { CommunityModule } from '@sunbird/community';

import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';

import { AnnouncementModule } from '@sunbird/announcement';
import { Ng2IziToastModule } from 'ng2-izitoast';
import { ToasterService } from './modules/core/services/toaster/toaster.service';

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
    AnnouncementModule,
    Ng2IziToastModule
  ],
  providers: [ToasterService
  ],
  entryComponents: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
  }
}
