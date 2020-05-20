import { TelemetryModule } from '@sunbird/telemetry';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
 import { SharedModule } from '@sunbird/shared';
import { CoreModule } from '@sunbird/core';
import { SharedFeatureModule } from '@sunbird/shared-feature';
import { EnrollBatchComponent } from './components/batch/enroll-batch/enroll-batch.component';
import { CreateBatchComponent } from './components/batch/create-batch/create-batch.component';
import { UpdateCourseBatchComponent } from './components/batch/update-course-batch/update-course-batch.component';
import { BatchRoutingModule } from './batch-routing.module';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SuiModule,
    FormsModule,
    CoreModule,
    TelemetryModule,
    SharedFeatureModule,
    BatchRoutingModule,
    ReactiveFormsModule
  ],
  providers: [],
  declarations: [EnrollBatchComponent, CreateBatchComponent, UpdateCourseBatchComponent]
})
export class BatchModule { }
