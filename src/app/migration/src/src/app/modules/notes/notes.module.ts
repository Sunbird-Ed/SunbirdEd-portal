import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesService } from './services';
import { NotesRoutingModule } from './notes-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { SuiModule } from 'ng2-semantic-ui';
import { FormsModule } from '@angular/forms';
import { OrderModule } from 'ngx-order-pipe';
import { FilterPipe } from './components';
import { NgxEditorModule } from 'ngx-editor';
import { MarkdownModule } from 'ngx-md';
import { DeleteNoteComponent, NoteCardComponent, NoteFormComponent, NoteListComponent } from './components/index';

@NgModule({
  imports: [
    CommonModule,
    NotesRoutingModule,
    SuiModule,
    FormsModule,
    OrderModule,
    BrowserModule,
    NgxEditorModule,
    MarkdownModule.forRoot()
  ],
  declarations: [FilterPipe, NoteListComponent, NoteCardComponent, NoteFormComponent, DeleteNoteComponent],
  providers: [NotesService],
  exports: [NoteListComponent]
})
export class NotesModule { }
