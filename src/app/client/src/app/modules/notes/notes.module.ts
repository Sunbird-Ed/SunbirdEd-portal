import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from './services';
import { NotesRoutingModule } from './notes-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { SharedModule } from '@sunbird/shared';
import { MarkdownModule } from 'ngx-md';
import { TimeAgoPipe } from 'time-ago-pipe';
import { NoteListComponent, InlineEditorComponent, NoteCardComponent, DeleteNoteComponent, PopupEditorComponent } from './components';
import { TelemetryModule } from '@sunbird/telemetry';
import { NgInviewModule } from 'angular-inport';

@NgModule({
  imports: [
    CommonModule,
    NotesRoutingModule,
    SuiModule,
    FormsModule,
    OrderModule,
    SharedModule,
    MarkdownModule.forRoot(),
    TelemetryModule,
    NgInviewModule
  ],
  declarations: [TimeAgoPipe, NoteListComponent, InlineEditorComponent,
    NoteCardComponent, PopupEditorComponent, DeleteNoteComponent],
  providers: [NotesService],
  exports: [NoteListComponent, PopupEditorComponent, NoteCardComponent]
})
export class NotesModule { }
