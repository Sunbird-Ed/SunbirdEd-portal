// Import modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// Import component
import { MainHomeComponent } from './component/index';
import { DetailsPopupComponent } from '@sunbird/announcement';
const telemetryEnv = 'home';
const objectType = 'home';
const routes: Routes = [
  {
     path: 'home', data: {
      telemetry: {
        env: telemetryEnv, pageid: 'home', uri: '/home', subtype: 'paginate',
        type: 'view', object: { type: objectType, ver: '1.0' }
      }
    },
    component: MainHomeComponent,
    children: [
      { path: 'view/:announcementId', component: DetailsPopupComponent,
       data: {
          telemetry: {
            env: telemetryEnv, pageid: 'announcement-read', type: 'view', object: { type: objectType, ver: '1.0' }
          }
        }
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
