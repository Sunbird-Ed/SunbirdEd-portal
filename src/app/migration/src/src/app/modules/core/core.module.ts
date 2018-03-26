
import { PermissionDirective } from './directives';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { FormsModule } from '@angular/forms';
import {
  UserService, LearnerService, PermissionService, AnnouncementService,
  BadgesService, ContentService, CoursesService, EditorService
} from './services';
import {
  MainHeaderComponent, MainMenuComponent , SearchComponent, CreateCollectionComponent,
  CollectionEditorComponent
} from './components';
 

@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SharedModule,
    RouterModule,
    FormsModule
  ],
  declarations: [ MainHeaderComponent, MainMenuComponent , SearchComponent , PermissionDirective, CreateCollectionComponent,
     CollectionEditorComponent],
  exports: [MainHeaderComponent],
  providers: [
    LearnerService, UserService,
    PermissionService, AnnouncementService, BadgesService, ContentService, CoursesService, EditorService ]
})
export class CoreModule {
}


