import { NoteListComponent, NoteFormComponent, DeleteNoteComponent, NoteCardComponent } from './components/index';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: 'notes',
  component: NoteListComponent,
  children: [{path: 'editor/:mode', component: NoteFormComponent},
  {path: 'remove', component: DeleteNoteComponent},
  {path: 'noteCard', component: NoteCardComponent,
  children: [{path: ':mode', component: NoteFormComponent}]
  }
]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class NotesRoutingModule { }
