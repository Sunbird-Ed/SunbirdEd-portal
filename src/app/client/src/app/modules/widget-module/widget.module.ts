import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui-v9';
import { TelemetryModule } from '@sunbird/telemetry';
import { MediaChapterlistComponent,MediaPlayerComponent,MediaContentpageComponent,ContentMediaComponent, MediaWidgetComponent, MediaCreditsComponent} from './components';
import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { FormsModule } from '@angular/forms';
import { CommonConsumptionModule } from '@project-sunbird/common-consumption';
import {SunbirdPdfPlayerModule} from '@project-sunbird/sunbird-pdf-player-v9';
import { SunbirdVideoPlayerModule } from '@project-sunbird/sunbird-video-player-v9';
import { SunbirdEpubPlayerModule } from '@project-sunbird/sunbird-epub-player-v9';
import { QumlPlayerService } from './service/quml-player.service';
import { QumlLibraryModule, QuestionCursor } from '@project-sunbird/sunbird-quml-player';
import { EditorCursor } from '@project-sunbird/sunbird-collection-editor';


@NgModule({
  providers: [
    { provide: QuestionCursor, useExisting: QumlPlayerService },
    { provide: EditorCursor, useExisting: QumlPlayerService }
  ],
  declarations: [
    MediaPlayerComponent,
    MediaChapterlistComponent,
    MediaContentpageComponent,
    ContentMediaComponent,
    MediaWidgetComponent,
    MediaCreditsComponent
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
    SunbirdVideoPlayerModule,
    SunbirdEpubPlayerModule,
    QumlLibraryModule
  ],
  exports: [
    MediaContentpageComponent,
    MediaChapterlistComponent, MediaWidgetComponent, MediaCreditsComponent
  ]
})
export class WidgetModule { }
