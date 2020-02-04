import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SanitizeHtmlPipe } from './pipe/sanitize-html.pipe';
import { QuestionListComponent,
  QuestionCreationComponent, ChapterListComponent, McqTemplateSelectionComponent,
  CkeditorToolComponent, QuestionPreviewComponent } from './components';
import { SuiTabsModule, SuiModule } from 'ng2-semantic-ui';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SharedModule } from '@sunbird/shared';
import { QuestionCreationHeaderComponent } from './components/question-creation-header/question-creation-header.component';
import { TelemetryModule } from '@sunbird/telemetry';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RecursiveTreeComponent } from './components/recursive-tree/recursive-tree.component';
import { ContentUploaderComponent } from './components/content-uploader/content-uploader.component';
import { ResourceTemplateComponent } from './components/resource-template/resource-template.component';
import { DynamicModule } from 'ng-dynamic-component';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import { CollectionComponent } from './components/collection/collection.component';
import { ResourceReorderComponent } from './components/resource-reorder/resource-reorder.component';
import { CollectionHierarchyService } from './services/collection-hierarchy/collection-hierarchy.service';
import { SlickModule } from 'ngx-slick';
import { DummyTestComponentComponent } from './components/dummy-test-component/dummy-test-component.component';

@NgModule({
  declarations: [QuestionListComponent, QuestionCreationComponent,
    ChapterListComponent, CkeditorToolComponent ,
    McqTemplateSelectionComponent,
    QuestionPreviewComponent, SanitizeHtmlPipe, QuestionCreationHeaderComponent,
    DashboardComponent, RecursiveTreeComponent,
    ContentUploaderComponent,  ResourceTemplateComponent, CollectionComponent, ResourceReorderComponent, DummyTestComponentComponent],
  imports: [
    CommonModule,
    SuiTabsModule,
    CommonConsumptionModule,
    SuiModule,
    ReactiveFormsModule, FormsModule, SharedModule,
    InfiniteScrollModule,
    PlayerHelperModule,
    TelemetryModule,
    SlickModule.forRoot(),
    DynamicModule.withComponents([QuestionListComponent,
       QuestionCreationComponent, ChapterListComponent, CkeditorToolComponent ,
      McqTemplateSelectionComponent,
      QuestionPreviewComponent, QuestionCreationHeaderComponent,
      DashboardComponent, RecursiveTreeComponent, ContentUploaderComponent, ResourceTemplateComponent]),

  ],
  providers: [CollectionHierarchyService],
  exports: [ SanitizeHtmlPipe ]
})
export class CbseProgramModule { }
