import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProgramComponent} from './component';

const routes: Routes = [
  {
    path: ':programId', component: ProgramComponent,
    data: {
      telemetry: { env: 'cbse_program', pageid: 'program', type: 'view', subtype: 'paginate' },
      config: { question_categories: ['vsa','sa','la','mcq']}
    }
  },
  {
    path: 'curiosity/:programId', component: ProgramComponent,
    data: {
      telemetry: { env: 'cbse_program', pageid: 'program', type: 'view', subtype: 'paginate' },
      config: { question_categories: ['curiosity'] }
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
