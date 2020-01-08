import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ContentPlayerPageComponent, TocPageComponent } from './components';

const routes: Routes = [
  {
    path: 'content/:contentId', component: ContentPlayerPageComponent, data: {
      telemetry: {
        env: 'player-page', pageid: 'play-content', type: 'view'
      },
    },
  },
  {
    path: 'collection/:collectionId', component: TocPageComponent, data: {
      telemetry: {
        env: 'player-page', pageid: 'play-collection', type: 'view'
      },
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentConsumptionRoutingModule { }
