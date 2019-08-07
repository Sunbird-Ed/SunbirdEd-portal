import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CertificateDetailsComponent } from './components';

const routes: Routes = [
  {
    path: ':uuid', component: CertificateDetailsComponent,
    data: {
      telemetry: { }
    }
  }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

  export class CertificateRoutingModule { }
