import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProgramComponent} from './component';

const routes: Routes = [
  {
    path: ':programId', component: ProgramComponent,
    data: {
      telemetry: { env: 'cbse_program', pageid: 'program', type: 'view', subtype: 'paginate' }
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [ RouterModule ]
})
export class ProgramRoutingModule { }
