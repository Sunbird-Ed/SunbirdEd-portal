import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@sunbird/core';
import { CertificateDetailsComponent, CertificateConfigurationComponent, CreateTemplateComponent} from './components';

const routes: Routes = [
  {
    path: 'configure/certificate', component: CertificateConfigurationComponent, canActivate: [AuthGuard],
    data: {
      telemetry: {
        env: 'certs', pageid: 'certificate-configuration', type: 'view', subtype: 'paginate', ver: '1.0'
      },
      roles: 'createBatchRole',
      hideHeaderNFooter: false
    }
  },
  {
    path: 'configure/create-template', component: CreateTemplateComponent, canActivate: [AuthGuard],
    data: {
      telemetry: {
        env: 'certs', pageid: 'certificate-create-template', type: 'view', subtype: 'paginate', ver: '1.0'
      },
      roles: 'createBatchRole',
      hideHeaderNFooter: false
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
