import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ContentCardComponent, AnnouncementInboxCardComponent,
  PageSectionComponent, NoResultComponent, AppLoaderComponent, PlayerComponent, ContentMetadataComponent,
  CollectionTreeComponent, FancyTreeComponent, CardComponent
} from './components';
import { ConfigService, ResourceService, FileUploadService, ToasterService, WindowScrollService ,
   PaginationService, RouterNavigationService, NavigationHelperService } from './services';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DateFormatPipe , DateFilterXtimeAgoPipe} from './pipes';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { CacheService } from 'ng2-cache-service';

@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SlickModule,
    FormsModule
  ],
  declarations: [AppLoaderComponent, AnnouncementInboxCardComponent,
    DateFormatPipe, PageSectionComponent, ContentCardComponent, NoResultComponent, DateFilterXtimeAgoPipe,
     CollectionTreeComponent, FancyTreeComponent, PlayerComponent, ContentMetadataComponent, CardComponent],
  exports: [AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe, DateFilterXtimeAgoPipe,
    PageSectionComponent, ContentCardComponent, NoResultComponent, CollectionTreeComponent, FancyTreeComponent,
    PlayerComponent, ContentMetadataComponent, CardComponent],
  providers: [ResourceService, ConfigService, FileUploadService, ToasterService, Ng2IzitoastService, PaginationService,
     RouterNavigationService, WindowScrollService, NavigationHelperService, CacheService]
})
export class SharedModule { }
