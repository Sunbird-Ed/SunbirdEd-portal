import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {MergeAccountStatusComponent} from './components/merge-account-status/merge-account-status.component';
import {MergeLoginComponent} from './components/merge-login/merge-login.component';

const routes: Routes = [
  {path: 'login/callback', component: MergeLoginComponent},
  {path: '', component: MergeAccountStatusComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MergeAccountRoutingModule {
}
