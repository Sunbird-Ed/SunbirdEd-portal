import { ProgramsService } from '@sunbird/core';
import { ListAllProgramsComponent } from './components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent } from './components';

const routes: Routes = [{
  path: '', component: ListAllProgramsComponent, canActivate: [ProgramsService]
},
{
  path: 'program/:programId', component: ProgramComponent,
  data: {
    telemetry: { env: 'cbse_program', pageid: 'program', type: 'view', subtype: 'paginate' },
    config: { question_categories: ['vsa', 'sa', 'la', 'mcq']}
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramRoutingModule { }
