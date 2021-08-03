import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '@sunbird/core';
import { WorkspaceRoutingModule } from './workspace-routing.module';
import { SharedModule } from '@sunbird/shared';
import { SlickModule } from 'ngx-slick';
import { SuiModule } from 'ng2-semantic-ui/dist';
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
import { CollectionEditorLibraryModule } from '@project-sunbird/sunbird-collection-editor';
import { EventsComponent } from './components/events/events.component';
import { EventLibraryModule } from '@tekdi/ngtek-event-library';
import  * as configData from './interfaces/urlConfig';
import { AllMyEventsComponent } from './components/all-my-events/all-my-events.component';

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
    EventLibraryModule.forChild(configData),
    CollectionEditorLibraryModule
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
    EventsComponent,
    AllMyEventsComponent
  ],
  providers: [WorkSpaceService, EditorService, BatchService, ReviewCommentsService, DateFilterXtimeAgoPipe]
})
export class WorkspaceModule { }
