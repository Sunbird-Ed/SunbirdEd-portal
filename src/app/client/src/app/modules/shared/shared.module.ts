import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ContentCardComponent, AnnouncementInboxCardComponent,
  PageSectionComponent, NoResultComponent, AppLoaderComponent
} from './components';
import { ConfigService, ResourceService, FileUploadService, ToasterService, WindowScrollService ,
   PaginationService, RouterNavigationService } from './services';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DateFormatPipe } from './pipes';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { PlayerComponent } from './components/player/player/player.component';
@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SlickModule,
    FormsModule
  ],
  declarations: [AppLoaderComponent, AnnouncementInboxCardComponent,
    DateFormatPipe, PageSectionComponent, ContentCardComponent, NoResultComponent, PlayerComponent],
  exports: [AppLoaderComponent, AnnouncementInboxCardComponent, DateFormatPipe,
    PageSectionComponent, ContentCardComponent, NoResultComponent, PlayerComponent],
  providers: [ResourceService, ConfigService, FileUploadService, ToasterService, Ng2IzitoastService, PaginationService,
     RouterNavigationService, WindowScrollService]
})
export class SharedModule { }
