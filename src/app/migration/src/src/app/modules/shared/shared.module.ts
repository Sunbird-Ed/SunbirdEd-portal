import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentCardComponent } from './components/content-card/content-card.component';
import { ConfigService, ResourceService } from './services';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppLoaderComponent } from './components/app-loader/app-loader.component';
import { AnnouncementInboxCardComponent } from './components/announcement-inbox-card/announcement-inbox-card.component';
import { DateFormatPipe } from './pipes/date-format/date-format.pipe';
import { PageSectionComponent } from './components/page-section/page-section.component';

@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SlickModule,
    FormsModule
  ],
  declarations: [AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe, PageSectionComponent, ContentCardComponent],
  exports: [AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe, PageSectionComponent, ContentCardComponent],
  providers: [ResourceService, ConfigService]
})
export class SharedModule { }
