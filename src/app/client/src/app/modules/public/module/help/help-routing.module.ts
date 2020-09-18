import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from './components';
const routes: Routes = [
  {
    path: '', component: FaqComponent, data: {
      routeReuse: {
        reuse: true,
        path: 'help'
      },
      telemetry: {
        env: 'help', pageid: 'faq', type: 'view', subtype: 'paginate'
      }
    }
  }
  ];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class HelpRoutingModule { }
