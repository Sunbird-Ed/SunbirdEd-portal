import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ContentCardComponent, AnnouncementInboxCardComponent,
  PageSectionComponent, NoResultComponent, AppLoaderComponent
} from './components';
import { ConfigService, ResourceService, FileUploadService } from './services';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DateFormatPipe, DateFilterXtimeAgoPipe } from './pipes';
@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SlickModule,
    FormsModule
  ],
  declarations: [AppLoaderComponent, AnnouncementInboxCardComponent,
    DateFormatPipe, PageSectionComponent, ContentCardComponent, NoResultComponent, DateFilterXtimeAgoPipe],
  exports: [AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe,
    DateFilterXtimeAgoPipe, PageSectionComponent, ContentCardComponent,
    NoResultComponent],
  providers: [ResourceService, ConfigService, FileUploadService]
})
export class SharedModule { }
