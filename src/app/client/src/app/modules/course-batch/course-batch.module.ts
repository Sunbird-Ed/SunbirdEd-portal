import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CourseBatchRoutingModule } from './course-batch-routing.module';
import { CreateCourseBatchComponent, ViewCourseBatchComponent , UpdateCourseBatchComponent} from './components';
@NgModule({
  imports: [
    CommonModule,
    CourseBatchRoutingModule
  ],
  declarations: [CreateCourseBatchComponent, ViewCourseBatchComponent, UpdateCourseBatchComponent]
})
export class CourseBatchModule { }
