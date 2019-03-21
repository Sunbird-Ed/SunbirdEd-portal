import { ResourceComponent } from './components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ViewAllComponent} from '@sunbird/shared-feature';
const telemetryEnv = 'library';
const routes: Routes = [
  {
    path: '', component: ResourceComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '' }],
      telemetry: { env: telemetryEnv, pageid: 'library', type: 'view', subtype: 'paginate' },
      softConstraints: {badgeAssertions: 98, board: 99, channel: 100}
    }
  }, {
    path: 'view-all/:section/:pageNumber', component: ViewAllComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '/resources' }],
      telemetry: {
        env: telemetryEnv, pageid: 'view-all', type: 'view', subtype: 'paginate'
      },
      filterType: 'library',
      softConstraints: {badgeAssertions: 98, board: 99, channel: 100},
      applyMode: true
    }
  },
  {
    path: 'play', loadChildren: './modules/player/player.module#PlayerModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceRoutingModule { }
