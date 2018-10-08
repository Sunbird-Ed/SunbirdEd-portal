import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { NgInviewModule } from 'angular-inport';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelemetryModule } from '@sunbird/telemetry';
import { CourseBatchRoutingModule } from './course-batch-routing.module';
import { CreateCourseBatchComponent, ViewCourseBatchComponent , UpdateCourseBatchComponent,
AddBatchMembersComponent} from './components';
import { SharedModule } from '@sunbird/shared';
import { CourseBatchService } from './services';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ClickOutsideDirective } from './directives';
@NgModule({
  imports: [
    CommonModule,
    SuiModule,
    NgInviewModule,
    FormsModule,
    ReactiveFormsModule,
    CourseBatchRoutingModule,
    SharedModule,
    TelemetryModule,
    AngularMultiSelectModule,
  ],
  declarations: [CreateCourseBatchComponent, ViewCourseBatchComponent, UpdateCourseBatchComponent, AddBatchMembersComponent,
    ClickOutsideDirective],
  providers: [CourseBatchService]
})
export class CourseBatchModule { }
