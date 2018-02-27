import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import {
  ConfigService, UserService, LearnerService,
  ResourceService, PermissionService, AnnouncementService,
  BadgesService, ContentService
} from './services';
import {
  MainHeaderComponent, MainMenuComponent , SearchComponent
} from './components';


@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SharedModule
  ],
  declarations: [ MainHeaderComponent, MainMenuComponent , SearchComponent ],
  exports: [MainHeaderComponent],
  providers: [
    ConfigService, LearnerService, ResourceService, UserService,
    PermissionService, AnnouncementService, BadgesService, ContentService ]
})
export class CoreModule {
}


