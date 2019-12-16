import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilePageComponent } from './components/';

const routes: Routes = [
  {
    path: 'profile', component: ProfilePageComponent, data: {
      telemetry: {
        env: 'profile', pageid: 'profile', type: 'view'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
