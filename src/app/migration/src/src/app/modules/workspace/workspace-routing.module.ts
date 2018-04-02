import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkspaceComponent, CreateContentComponent, DraftComponent ,
  ReviewSubmissionsComponent, PublishedComponent} from './components/index';
import { AuthGuard } from '../core/guard/auth-gard.service';
const routes: Routes = [
  {
    path: 'workspace/content', component: WorkspaceComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'create', pathMatch: 'full' },
      { path: 'create', component: CreateContentComponent },
      { path: 'draft/:pageNumber', component: DraftComponent },
      { path: 'review/:pageNumber', component: ReviewSubmissionsComponent },
      { path: 'published/:pageNumber', component: PublishedComponent },
      {path: '**', redirectTo : 'create'}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }


