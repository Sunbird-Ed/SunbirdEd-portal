import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { TelemetryModule } from '@sunbird/telemetry';
import {
  ContentCreditsComponent, PlayerComponent, ContentPlayerMetadataComponent,
  FancyTreeComponent, CollectionPlayerMetadataComponent,
  ContentRatingComponent, CommingSoonComponent,
  CreditsAndLicenceComponent, ContentActionsComponent, ContentPlayerComponent,
  ContentPlayerPageComponent, ContentChapterlistComponent, ContentLicenceComponent,
  CurriculumInfoComponent, CourseInfoComponent
} from './components';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { FormsModule } from '@angular/forms';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import {QumlPlayerV2Service} from './service/quml-player-v2/quml-player-v2.service';
// import { QumlPlayerService } from './service/quml-player/quml-player.service';
import { QumlLibraryModule as QsLibModule, QuestionCursor as QsCursor} from '@project-sunbird/sunbird-quml-player';
// import { QumlLibraryModule, QuestionCursor } from '@project-sunbird/sunbird-quml-player-v9';
import { EditorCursor } from '@project-sunbird/sunbird-collection-editor';
import { EditorCursor as QsEditorCursor } from '@project-sunbird/sunbird-questionset-editor';
import { CslFrameworkService } from '../public/services/csl-framework/csl-framework.service';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: QsEditorCursor, useExisting: QumlPlayerV2Service },
    { provide: QsCursor, useExisting: QumlPlayerV2Service },
    CslFrameworkService
    // { provide: QuestionCursor, useExisting: QumlPlayerService },
    // { provide: EditorCursor, useExisting: QumlPlayerService },
  ],
  imports: [
    CommonModule,
    SuiModule,
    TelemetryModule,
    SharedModule,
    CoreModule,
    FormsModule,
    CommonConsumptionModule,
    QsLibModule,
    // QumlLibraryModule,
  ],
  declarations: [ContentCreditsComponent, PlayerComponent, ContentPlayerMetadataComponent,
    FancyTreeComponent, CollectionPlayerMetadataComponent, ContentRatingComponent,
    CommingSoonComponent, CreditsAndLicenceComponent, ContentActionsComponent,
    ContentPlayerComponent, ContentPlayerPageComponent, ContentChapterlistComponent,
    ContentLicenceComponent,
    CurriculumInfoComponent,
    CourseInfoComponent],
  exports: [ContentCreditsComponent, PlayerComponent, ContentPlayerMetadataComponent,
    FancyTreeComponent, CollectionPlayerMetadataComponent, ContentRatingComponent,
    CommingSoonComponent, CreditsAndLicenceComponent, ContentActionsComponent,
    ContentPlayerComponent, ContentPlayerPageComponent, ContentChapterlistComponent,
    ContentLicenceComponent, CurriculumInfoComponent, CourseInfoComponent],
})
export class PlayerHelperModule { }
