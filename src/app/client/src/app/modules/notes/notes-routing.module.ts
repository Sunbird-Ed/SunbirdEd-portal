import { NoteListComponent } from './components';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: 'learn/:courseId/:contentId/notes',
  component: NoteListComponent,
  // children: [{path: ':mode/:noteId', component: NoteFormComponent},
  //            {path: ':mode', component: NoteFormComponent}]
},
{
path: ':courseId/:contentId/noteCard',
  // component: NoteCardComponent,
  // children: [{path: ':mode', component: NoteFormComponent}]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class NotesRoutingModule { }
