import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfilePageComponent, AboutUsComponent, TelemetryComponent } from './components';

const routes: Routes = [
  {
    path: 'profile', component: ProfilePageComponent, data: {
      telemetry: {
        env: 'profile', pageid: 'profile', type: 'view'
      }
    }
  },
  {
    path: 'about-us', component: AboutUsComponent, data: {
      telemetry: {
        env: 'about-us', pageid: 'about-us', type: 'view'
      }
    }
  },
  {
    path: 'telemetry', component: TelemetryComponent, data: {
      telemetry: {
        env: 'telemetry', pageid: 'telemetry', type: 'view'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
