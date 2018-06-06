import { ResourceComponent, CollectionPlayerComponent, ContentPlayerComponent } from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlagContentComponent } from '@sunbird/core';
import { NoteListComponent } from '@sunbird/notes';
const telemetryEnv = 'library';
const routes: Routes = [
  {
    path: 'resources', component: ResourceComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '' }],
      telemetry: { env: telemetryEnv, pageid: 'resources', type: 'view' }
    }
  }, {
    path: 'resources/play/collection/:collectionId', component: CollectionPlayerComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '' }],
      telemetry: { env: telemetryEnv, pageid: 'collection-player', type: 'play' }
    },
    children: [
      { path: 'flag', component: FlagContentComponent }
    ]
  }, {
    path: 'resources/play/collection/:collectionId/:collectionStatus', component: CollectionPlayerComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '' }],
      telemetry: { env: telemetryEnv, pageid: 'collection-player-unlisted', type: 'play' }
    }
  }, {
    path: 'resources/play/content/:contentId', component: ContentPlayerComponent,
    data: {
      telemetry: {
        env: telemetryEnv, pageid: 'content-player', type: 'play'
      }, breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '/resources' }]
    },
    children: [
      { path: 'flag', component: FlagContentComponent }
    ]
  }, {
    path: 'resources/play/content/:contentId/note', component: NoteListComponent
  }, {
    path: 'resources/play/content/:contentId/:contentStatus', component: ContentPlayerComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '' }],
      telemetry: { env: telemetryEnv, pageid: 'content-player-unlisted', type: 'play' }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceRoutingModule { }
