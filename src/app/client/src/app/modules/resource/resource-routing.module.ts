import { ResourceComponent, CollectionPlayerComponent, ContentPlayerComponent } from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlagContentComponent } from '@sunbird/core';

const routes: Routes = [
  {
    path: 'resources', component: ResourceComponent,
    data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '' }] }
  }, {
    path: 'resources/play/collection/:collectionId', component: CollectionPlayerComponent,
    children: [
      { path: 'flag', component: FlagContentComponent }
    ]
  }, {
    path: 'resources/play/content/:contentId', component: ContentPlayerComponent,
    children: [
      { path: 'flag', component: FlagContentComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceRoutingModule { }
