
import { PermissionDirective } from './directives';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui';
import { SharedModule } from '@sunbird/shared';
import { FormsModule } from '@angular/forms';
import {
  UserService, LearnerService, PermissionService, AnnouncementService,
  BadgesService, ContentService, CoursesService, PageApiService, EditorService
} from './services';
import {
  MainHeaderComponent, MainMenuComponent , SearchComponent, CreateCollectionComponent,
  CollectionEditorComponent
} from './components';

import { CreateContentComponent } from './components/create-content/create-content.component';
import { ContentEditorComponent } from './components/content-editor/content-editor.component';

import { AuthGuard } from './guard/auth-gard.service';

@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    SharedModule,
    RouterModule,
    FormsModule
  ],
  declarations: [ MainHeaderComponent, MainMenuComponent , SearchComponent , PermissionDirective, CreateCollectionComponent,
     CollectionEditorComponent,

     CreateContentComponent,

     ContentEditorComponent],
  exports: [MainHeaderComponent],
  providers: [
    LearnerService, UserService,
    PermissionService, AnnouncementService, BadgesService, ContentService, CoursesService, PageApiService, EditorService , AuthGuard]

})
export class CoreModule {
}


