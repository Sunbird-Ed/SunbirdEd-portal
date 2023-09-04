import { NgModule } from '@angular/core';
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
import {SunbirdPdfPlayerModule} from '@project-sunbird/sunbird-pdf-player-v9';
import { QumlPlayerService } from './service/quml-player/quml-player.service';
import { QumlLibraryModule, QuestionCursor } from 'compass-sunbird-quml-player';
// import { EditorCursor } from '@project-sunbird/sunbird-collection-editor';
import { EditorCursor } from 'compass-collection-editor';
import { SunbirdEpubPlayerModule } from '@project-sunbird/sunbird-epub-player-v9';
import { SunbirdVideoPlayerModule } from '@project-sunbird/sunbird-video-player-v9';

@NgModule({
  providers: [
    { provide: QuestionCursor, useExisting: QumlPlayerService },
    { provide: EditorCursor, useExisting: QumlPlayerService }
  ],
  imports: [
    CommonModule,
    SuiModule,
    TelemetryModule,
    SharedModule,
    CoreModule,
    FormsModule,
    CommonConsumptionModule,
    SunbirdPdfPlayerModule,
   QumlLibraryModule,
   SunbirdEpubPlayerModule,
   SunbirdVideoPlayerModule,
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
