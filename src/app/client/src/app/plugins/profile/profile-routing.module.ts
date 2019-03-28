import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilePageComponent } from './components';
const telemetryEnv = 'profile';
const objectType = 'profile';
const routes: Routes = [
  {
    path: '', component: ProfilePageComponent,
    data: {
      telemetry: {
        env: telemetryEnv, type: 'view', mode: 'create', subtype: 'paginate', object: { type: objectType, ver: '1.0' }
      }, breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
