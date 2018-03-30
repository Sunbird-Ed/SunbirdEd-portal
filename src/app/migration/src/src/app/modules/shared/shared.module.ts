import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentCardComponent } from './components';
import { ConfigService, ResourceService } from './services';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppLoaderComponent } from './components';
import { AnnouncementInboxCardComponent } from './components';
import { DateFormatPipe } from './pipes';
import { PageSectionComponent } from './components';
import { NoResultComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SlickModule,
    FormsModule
  ],
  declarations: [AppLoaderComponent, AnnouncementInboxCardComponent,
  DateFormatPipe, PageSectionComponent, ContentCardComponent, NoResultComponent],
  exports: [AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe,
  PageSectionComponent, ContentCardComponent, NoResultComponent],
  providers: [ResourceService, ConfigService]
})
export class SharedModule { }
