import { ProgramsService } from '@sunbird/core';
import { ListAllProgramsComponent } from './components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProgramComponent } from './components';

const routes: Routes = [{
  path: '', component: ListAllProgramsComponent, canActivate: [ProgramsService],
  data: {
    telemetry: {
      env: 'contribute', pageid: 'programs-list', type: 'view', subtype: 'paginate'
    }
  }
},
{
  path: 'program/:programId', component: ProgramComponent,
  data: {
    telemetry: { env: 'programs_portal', pageid: 'program', type: 'view', subtype: 'paginate' },
    config: { question_categories: ['vsa', 'sa', 'la', 'mcq']}
  }
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProgramRoutingModule { }
