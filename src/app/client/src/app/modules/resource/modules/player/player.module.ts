import { PlayerRoutingModule } from './player-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollectionPlayerComponent, ContentPlayerComponent } from './components';
import { TelemetryModule } from '@sunbird/telemetry';
import { SharedModule } from '@sunbird/shared';
import { BadgingModule } from '@sunbird/badge';
import { CoreModule } from '@sunbird/core';
import { PlayerHelperModule } from '@sunbird/player-helper';
import { NotesModule } from '@sunbird/notes';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        SuiModule,
        PlayerRoutingModule,
        TelemetryModule,
        FormsModule,
        SharedModule,
        BadgingModule,
        CoreModule,
        PlayerHelperModule,
        NotesModule
    ],
    providers: [],
    declarations: [CollectionPlayerComponent, ContentPlayerComponent]
})
export class PlayerModule { }
