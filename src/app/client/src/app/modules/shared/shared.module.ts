import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ContentCardComponent, AnnouncementInboxCardComponent,
  PageSectionComponent, NoResultComponent, AppLoaderComponent,
  CollectionTreeComponent, FancyTreeComponent
} from './components';
import { ConfigService, ResourceService, FileUploadService, ToasterService, WindowScrollService ,
   PaginationService, RouterNavigationService } from './services';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DateFormatPipe , DateFilterXtimeAgoPipe} from './pipes';
import { Ng2IzitoastService } from 'ng2-izitoast';

@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SlickModule,
    FormsModule
  ],
  declarations: [AppLoaderComponent, AnnouncementInboxCardComponent,
    DateFormatPipe, PageSectionComponent, ContentCardComponent, NoResultComponent, DateFilterXtimeAgoPipe,
     CollectionTreeComponent, FancyTreeComponent],
  exports: [AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe, DateFilterXtimeAgoPipe,
    PageSectionComponent, ContentCardComponent, NoResultComponent, CollectionTreeComponent, FancyTreeComponent],
  providers: [ResourceService, ConfigService, FileUploadService, ToasterService, Ng2IzitoastService, PaginationService,
     RouterNavigationService, WindowScrollService]
})
export class SharedModule { }
