import { ResourceComponent, ContentPlayerComponent } from './components';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FlagContentComponent } from '@sunbird/core';

const routes: Routes = [
  {
    path: 'resources', component: ResourceComponent,
    data: { breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '' }] }
  },
  {
    path: 'resources/play/content/:contentId/:contentName', component: ContentPlayerComponent,
    children: [
      { path: 'flag-content', component: FlagContentComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceRoutingModule { }
