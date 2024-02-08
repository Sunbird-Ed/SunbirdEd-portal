import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuestProfileComponent } from './components/guest-profile/guest-profile.component';
import { AnonymousDeleteUserComponent } from './components/delete-user/anonymous-delete-user.component';


const routes: Routes = [
  {
    path: '', component: GuestProfileComponent, data: {
      menuBar: {
        visible: false
    },
      telemetry: {
        env: 'profile', pageid: 'guest-profile', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'delete-user', component: AnonymousDeleteUserComponent,
    data: {
      menuBar: {
        visible: false
      },
      pageTitle: 'delete-user',
      telemetry: {
        env: 'profile', type: 'view'
      }
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GuestProfileRoutingModule { }
