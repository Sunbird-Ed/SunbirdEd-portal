import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { WorkSpaceService, EditorService , BatchService} from './services';
import {
  WorkspaceComponent, CreateContentComponent, DraftComponent,
  ReviewSubmissionsComponent, PublishedComponent, UploadedComponent,
  CollectionEditorComponent, ContentEditorComponent, GenericEditorComponent,
  WorkspacesidebarComponent, BatchListComponent, BatchCardComponent, UpdateBatchComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    WorkspaceRoutingModule,
    SharedModule,
    SuiModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule
  ],
  declarations: [WorkspaceComponent, WorkspacesidebarComponent,
    CreateContentComponent, DraftComponent, ReviewSubmissionsComponent,
    PublishedComponent, UploadedComponent, CollectionEditorComponent,
    ContentEditorComponent, GenericEditorComponent, BatchListComponent,
    BatchCardComponent, UpdateBatchComponent],
  providers: [WorkSpaceService, EditorService, BatchService]
})
export class WorkspaceModule { }
