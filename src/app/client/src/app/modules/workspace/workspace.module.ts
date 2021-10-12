import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { SharedModule } from '@sunbird/shared';
import { SlickModule } from 'ngx-slick';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { WorkSpaceService, EditorService , BatchService, ReviewCommentsService} from './services';
import {
  WorkspaceComponent, CreateContentComponent, DraftComponent,
  ReviewSubmissionsComponent, PublishedComponent, UploadedComponent,
  CollectionEditorComponent, ContentEditorComponent, GenericEditorComponent,
  WorkspacesidebarComponent, DataDrivenComponent, DefaultTemplateComponent,
  FlaggedComponent, UpForReviewComponent, UpforReviewFilterComponent,
  BatchListComponent, BatchPageSectionComponent, UpdateBatchComponent,
  UpforreviewContentplayerComponent, FlagConentplayerComponent, ReviewsubmissionsContentplayerComponent,
  PublishedPopupComponent, RequestChangesPopupComponent, LimitedPublishedComponent,
  AllContentComponent, FlagReviewerComponent, CollaboratingOnComponent,
  CollaborationContentFilterComponent, WorkspaceContentFilterComponent, AllTextbooksComponent, NewCollectionEditorComponent
} from './components';
import { DateFilterXtimeAgoPipe } from './pipes';
import { NgInviewModule } from 'angular-inport';
import { TelemetryModule } from '@sunbird/telemetry';
import { ReviewCommentsComponent } from './components/review-comments/review-comments.component';
import { OrderModule } from 'ngx-order-pipe';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { ContentSearchModule } from '@sunbird/content-search';
import { CollectionEditorLibraryModule } from '@project-sunbird/sunbird-collection-editor-v9';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    SlickModule,
    WorkspaceRoutingModule,
    SharedModule,
    SuiModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule,
    NgInviewModule,
    TelemetryModule,
    OrderModule,
    PlayerHelperModule,
    ContentSearchModule,
    CollectionEditorLibraryModule,
    MatTooltipModule
  ],
  declarations: [WorkspaceComponent, WorkspacesidebarComponent, DateFilterXtimeAgoPipe,
    CreateContentComponent, DraftComponent, ReviewSubmissionsComponent,
    PublishedComponent, UploadedComponent, CollectionEditorComponent,
    ContentEditorComponent, GenericEditorComponent, UpForReviewComponent, UpforReviewFilterComponent,
    DataDrivenComponent, UpForReviewComponent, UpforReviewFilterComponent, DefaultTemplateComponent,
    FlaggedComponent, BatchListComponent, BatchPageSectionComponent, UpdateBatchComponent,
    UpforreviewContentplayerComponent,
    FlagConentplayerComponent,
    ReviewsubmissionsContentplayerComponent,
    PublishedPopupComponent,
    RequestChangesPopupComponent,
    LimitedPublishedComponent,
    AllContentComponent,
    AllTextbooksComponent,
    FlagReviewerComponent,
    CollaboratingOnComponent,
    CollaborationContentFilterComponent,
    ReviewCommentsComponent,
    CollaborationContentFilterComponent,
    WorkspaceContentFilterComponent,
    NewCollectionEditorComponent
  ],
  providers: [WorkSpaceService, EditorService, BatchService, ReviewCommentsService, DateFilterXtimeAgoPipe]
})
export class WorkspaceModule { }
