import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { QumlPlayerService } from './service/quml-player/quml-player.service';

@NgModule({
  providers: [
  ],
  imports: [
    CommonModule,
    SuiModule,
    TelemetryModule,
    SharedModule,
    CoreModule,
    FormsModule,
    CommonConsumptionModule,
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
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
