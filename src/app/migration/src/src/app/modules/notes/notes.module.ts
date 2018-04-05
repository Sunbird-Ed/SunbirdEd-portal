import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from './services';
import { NotesRoutingModule } from './notes-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipe, SharedModule } from '@sunbird/shared';
import { MarkdownModule } from 'ngx-md';
import { TimeAgoPipe } from 'time-ago-pipe';
import { DeleteNoteComponent, NoteCardComponent, NoteFormComponent, NoteListComponent } from './components/index';

@NgModule({
  imports: [
    CommonModule,
    NotesRoutingModule,
    SuiModule,
    FormsModule,
    OrderModule,
    BrowserModule,
    SharedModule,
    MarkdownModule.forRoot()
  ],
  declarations: [TimeAgoPipe, FilterPipe, NoteListComponent, NoteCardComponent, NoteFormComponent, DeleteNoteComponent],
  providers: [NotesService],
  exports: [NoteListComponent]
})
export class NotesModule { }
