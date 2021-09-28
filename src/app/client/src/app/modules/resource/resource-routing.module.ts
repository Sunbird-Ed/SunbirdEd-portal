import { CurriculumCoursesComponent } from './components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewAllComponent } from '@sunbird/content-search';
const telemetryEnv = 'library';
const routes: Routes = [
  {
    path: '', loadChildren: () => import('./../explore-page/explore-page.module').then(m => m.ExplorePageModule)
  },
  {
    path: 'view-all/:section/:pageNumber', component: ViewAllComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '/resources' }],
      telemetry: {
        env: telemetryEnv, pageid: 'view-all', type: 'view', subtype: 'paginate'
      },
      filterType: 'library',
      softConstraints: { badgeAssertions: 98, board: 99, channel: 100 },
      applyMode: true,
      facets: true
    }
  },
  {
    path: 'play', loadChildren: () => import('./modules/player/player.module').then(m => m.PlayerModule)
  },
  {
    path: 'curriculum-courses', component: CurriculumCoursesComponent, data: {
      telemetry: {
        env: 'curriculum-courses', pageid: 'curriculum-courses', type: 'view', subtype: 'paginate'
      },
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourceRoutingModule { }
