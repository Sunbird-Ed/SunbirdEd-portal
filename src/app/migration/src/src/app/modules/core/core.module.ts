import { PermissionDirective } from './directives';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { AuthGuard } from './guard/auth-gard.service';
import {
  UserService, LearnerService, PermissionService, AnnouncementService,
  BadgesService, ContentService, CoursesService, PageApiService
} from './services';
import {
  MainHeaderComponent, MainMenuComponent, SearchComponent
} from './components';


@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SharedModule,
    RouterModule
  ],
  declarations: [MainHeaderComponent, MainMenuComponent, SearchComponent, PermissionDirective],
  exports: [MainHeaderComponent],
  providers: [
    LearnerService, UserService, AuthGuard,
    PermissionService, AuthGuard, AnnouncementService, BadgesService, ContentService, CoursesService]
})
export class CoreModule {
}


