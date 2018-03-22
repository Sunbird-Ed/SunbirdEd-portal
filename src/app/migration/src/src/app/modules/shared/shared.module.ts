import { ConfigService, ResourceService } from './services';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';
import { AnnouncementInboxCardComponent } from './components/announcement-inbox-card/announcement-inbox-card.component';
import { DateFormatPipe } from './pipes/date-format/date-format.pipe';
import { ContentCardComponent } from './components/content-card/content-card.component';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    FormsModule,
],

  declarations: [ContentCardComponent, AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe],
  exports: [ContentCardComponent, AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe],
  providers: [ResourceService, ConfigService]
})
export class SharedModule { }
