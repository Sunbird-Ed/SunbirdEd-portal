import { ConfigService, ResourceService } from './services';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';
import { AnnouncementInboxCardComponent } from './components/announcement-inbox-card/announcement-inbox-card.component';
import { DateFormatPipe } from './pipes/date-format/date-format.pipe';

@NgModule({
  imports: [
    CommonModule,
  ],

  declarations: [AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe],
  exports: [AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe],
  providers: [ResourceService, ConfigService]
})
export class SharedModule { }
