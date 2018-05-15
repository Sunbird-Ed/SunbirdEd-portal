import { ResourceComponent, CollectionPlayerComponent, ContentPlayerComponent } from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlagContentComponent } from '@sunbird/core';
import { NoteListComponent } from '@sunbird/notes';

const routes: Routes = [
  {
    path: 'resources', component: ResourceComponent,
    data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '' }] }
  }, {
    path: 'resources/play/collection/:collectionId', component: CollectionPlayerComponent
  }, {
    path: 'resources/play/content/:contentId', component: ContentPlayerComponent,
    children: [
      { path: 'flag-content', component: FlagContentComponent }
    ]
  }, {
    path: 'resources/play/content/:contentId/note', component: NoteListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceRoutingModule { }
