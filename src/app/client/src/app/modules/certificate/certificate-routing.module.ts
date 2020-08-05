import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@sunbird/core';
import { CertificateDetailsComponent, CertificateConfigurationComponent} from './components';

const routes: Routes = [
  {
    path: ':mode/certificate', component: CertificateConfigurationComponent, canActivate: [AuthGuard],
    data: {
      telemetry: {
        env: 'certs', pageid: 'certificate-details', type: 'view'
      },
      roles: 'courseBatchRoles'
    }
  },
  {
    path: ':uuid', component: CertificateDetailsComponent,
    data: {
      telemetry: {
        env: 'certs', pageid: 'certificate-details', type: 'view'
      }
    }
  }
  ];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })

  export class CertificateRoutingModule { }
