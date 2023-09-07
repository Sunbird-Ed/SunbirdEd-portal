import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { SharedModule } from '@sunbird/shared';
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
import { TelemetryModule } from '@sunbird/telemetry';
import { ReviewCommentsComponent } from './components/review-comments/review-comments.component';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { ContentSearchModule } from '@sunbird/content-search';
import { CollectionEditorLibraryModule } from '@project-sunbird/sunbird-collection-editor'; //commented for infinite-scroll
import { QuestionsetEditorLibraryModule } from 'compass-collection-editor';
import { MatTooltipModule } from '@angular/material/tooltip';
import { taxonomyEnvironment } from '../../framework.config';
import { SbTaxonomyEditorModule } from 'sb-taxonomy-editor'
import { MatIconModule } from '@angular/material/icon'
import { TaxonomyViewWrapComponent } from './components/taxonomy-view-wrap/taxonomy-view-wrap.component';

@NgModule({
  imports: [ 
    CommonModule,
    WorkspaceRoutingModule,
    SharedModule,
    SuiModule,
    FormsModule,
    CoreModule,
    ReactiveFormsModule,
    TelemetryModule,
    PlayerHelperModule,
    ContentSearchModule,
    CollectionEditorLibraryModule,
    QuestionsetEditorLibraryModule, //commented for infinte-scroll
    MatTooltipModule,
    MatIconModule,
    SbTaxonomyEditorModule
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
    NewCollectionEditorComponent,
    TaxonomyViewWrapComponent
  ],
  providers: [WorkSpaceService, EditorService, BatchService, ReviewCommentsService, DateFilterXtimeAgoPipe]
})
export class WorkspaceModule { }
