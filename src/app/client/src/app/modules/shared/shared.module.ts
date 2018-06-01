import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ContentCardComponent, AnnouncementInboxCardComponent,
  PageSectionComponent, NoResultComponent, AppLoaderComponent, PlayerComponent,
  CollectionTreeComponent, FancyTreeComponent, CardComponent, ShareLinkComponent, CollectionPlayerMetadataComponent
} from './components';
import {
  ConfigService, ResourceService, FileUploadService, ToasterService, WindowScrollService,
  PaginationService, RouterNavigationService, NavigationHelperService, UtilService, ContentUtilsServiceService
} from './services';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DateFormatPipe, DateFilterXtimeAgoPipe, FilterPipe } from './pipes';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { CacheService } from 'ng2-cache-service';
import { NgInviewModule } from 'angular-inport';

@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SlickModule,
    FormsModule,
    NgInviewModule
  ],
  declarations: [AppLoaderComponent, AnnouncementInboxCardComponent,
    DateFormatPipe, PageSectionComponent, ContentCardComponent, NoResultComponent, DateFilterXtimeAgoPipe,
    CollectionTreeComponent, FancyTreeComponent, PlayerComponent, CardComponent, FilterPipe,
    ShareLinkComponent, CollectionPlayerMetadataComponent],
  exports: [AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe, DateFilterXtimeAgoPipe,
    PageSectionComponent, ContentCardComponent, NoResultComponent, CollectionTreeComponent, FancyTreeComponent,
    PlayerComponent, CardComponent, FilterPipe, ShareLinkComponent, CollectionPlayerMetadataComponent],
  providers: [ResourceService, ConfigService, FileUploadService, ToasterService, Ng2IzitoastService, PaginationService,
    RouterNavigationService, WindowScrollService, NavigationHelperService, CacheService, UtilService, ContentUtilsServiceService]
})
export class SharedModule { }
