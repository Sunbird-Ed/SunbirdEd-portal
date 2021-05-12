import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuestProfileComponent } from './components/guest-profile/guest-profile.component';


const routes: Routes = [
  {
    path: '', component: GuestProfileComponent, data: {
      telemetry: {
        env: 'profile', pageid: 'guest-profile', type: 'view', subtype: 'paginate'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestProfileRoutingModule { }
