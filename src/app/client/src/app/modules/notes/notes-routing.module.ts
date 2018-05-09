import { NoteListComponent, NoteCardComponent } from './components';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [{
  path: 'learn/:courseId/:contentId/notes',
  component: NoteListComponent
},
{
path: 'learn/:courseId/:contentId/noteCard',
  component: NoteCardComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class NotesRoutingModule { }
