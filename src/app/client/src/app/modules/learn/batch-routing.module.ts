import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateCourseBatchComponent } from './components/batch/update-course-batch/update-course-batch.component';
import { CreateBatchComponent } from './components/batch/create-batch/create-batch.component';
import { EnrollBatchComponent } from './components/batch/enroll-batch/enroll-batch.component';
import { AuthGuard } from '@sunbird/core';

const telemetryEnv = 'Course';
const objectType = 'Course';
const routes: Routes = [
  {
    path: 'enroll/batch/:batchId', component: EnrollBatchComponent,
    data: {
      telemetry: { env: telemetryEnv, pageid: 'batch-enroll', type: 'view', object: { ver: '1.0', type: 'batch' } }
    }
  },
  {
    path: 'update/batch/:batchId', component: UpdateCourseBatchComponent, canActivate: [AuthGuard],
    data: {
      telemetry: { env: telemetryEnv, pageid: 'batch-edit', type: 'view', object: { ver: '1.0', type: 'batch' } },
      roles: 'createBatchRole'
    }
  },
  {
    path: 'create/batch', component: CreateBatchComponent, canActivate: [AuthGuard],
    data: {
      telemetry: {
        env: telemetryEnv, pageid: 'batch-create', type: 'view', mode: 'create',
        object: { ver: '1.0', type: 'batch' }
      },
      roles: 'createBatchRole'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BatchRoutingModule { }
