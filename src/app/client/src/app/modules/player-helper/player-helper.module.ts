import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { TelemetryModule } from '@sunbird/telemetry';
import {
  ContentCreditsComponent, PlayerComponent, ContentPlayerMetadataComponent,
  CollectionTreeComponent, FancyTreeComponent, CollectionPlayerMetadataComponent,
  ContentRatingComponent, CommingSoonComponent,
  CreditsAndLicenceComponent, ContentActionsComponent, ContentPlayerComponent,
  ContentPlayerPageComponent, ContentChapterlistComponent, ContentLicenceComponent,
  CurriculumInfoComponent, CourseInfoComponent
} from './components';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { FormsModule } from '@angular/forms';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption-v8';
import {SunbirdPdfPlayerModule} from '@project-sunbird/sunbird-pdf-player-v8';
import { SunbirdVideoPlayerModule } from '@project-sunbird/sunbird-video-player-v8';
import { SunbirdEpubPlayerModule } from '@project-sunbird/sunbird-epub-player-v8';
import { QumlLibraryModule } from '@project-sunbird/sunbird-quml-player';


@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    TelemetryModule,
    SharedModule,
    CoreModule,
    FormsModule,
    CommonConsumptionModule,
    SunbirdPdfPlayerModule,
    SunbirdVideoPlayerModule,
    SunbirdEpubPlayerModule,
   QumlLibraryModule
  ],
  declarations: [ContentCreditsComponent, PlayerComponent, ContentPlayerMetadataComponent,
    CollectionTreeComponent, FancyTreeComponent, CollectionPlayerMetadataComponent, ContentRatingComponent,
    CommingSoonComponent, CreditsAndLicenceComponent, ContentActionsComponent,
    ContentPlayerComponent, ContentPlayerPageComponent, ContentChapterlistComponent,
    ContentLicenceComponent,
    CurriculumInfoComponent,
    CourseInfoComponent],
  exports: [ContentCreditsComponent, PlayerComponent, ContentPlayerMetadataComponent,
    CollectionTreeComponent, FancyTreeComponent, CollectionPlayerMetadataComponent, ContentRatingComponent,
    CommingSoonComponent, CreditsAndLicenceComponent, ContentActionsComponent,
    ContentPlayerComponent, ContentPlayerPageComponent, ContentChapterlistComponent,
    ContentLicenceComponent, CurriculumInfoComponent, CourseInfoComponent]
})
export class PlayerHelperModule { }
