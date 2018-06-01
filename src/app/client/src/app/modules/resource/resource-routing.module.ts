import { ResourceComponent, CollectionPlayerComponent, ContentPlayerComponent } from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlagContentComponent } from '@sunbird/core';
import { NoteListComponent } from '@sunbird/notes';
const telemetryEnv = 'library';
const objectType = 'library';

const routes: Routes = [
  {
    path: 'resources', component: ResourceComponent,
    data: {
      telemetry: {
        env: telemetryEnv, pageid: 'library-read', subtype: 'scroll', type: 'list', uri: '/resources', object: { type: objectType, ver: '1.0' }
      },
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '' }]
    }
  }, {
    path: 'resources/play/collection/:collectionId', component: CollectionPlayerComponent,
    data: {
      telemetry: {
        env: telemetryEnv, pageid: 'library-read', subtype: 'paginate', type: 'view', uri: '/resources/play/collection/', object: { type: objectType, ver: '1.0' }
      }
    },
    children: [
      { path: 'flag', component: FlagContentComponent }
    ]
  }, {
    path: 'resources/play/collection/:collectionId/:collectionStatus', component: CollectionPlayerComponent,
  }, {
    path: 'resources/play/content/:contentId', component: ContentPlayerComponent,
    data: {
      telemetry: {
        env: telemetryEnv, pageid: 'library-read', subtype: 'paginate', type: 'view', uri: '/resources/play/content/', object: { type: objectType, ver: '1.0' }
      },
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '/resources' }]
    },
    children: [
      { path: 'flag', component: FlagContentComponent }
    ]
  }, {
    path: 'resources/play/content/:contentId/note', component: NoteListComponent,
    data: {
      telemetry: {
        env: telemetryEnv, pageid: 'content-note-read', type: 'list', object: { type: objectType, ver: '1.0' }
      }
    }
  }, {
    path: 'resources/play/content/:contentId/:contentStatus', component: ContentPlayerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceRoutingModule { }
