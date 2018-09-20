import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CourseBatchRoutingModule } from './course-batch-routing.module';
import { CreateCourseBatchComponent, ViewCourseBatchComponent , UpdateCourseBatchComponent} from './components';
@NgModule({
  imports: [
    CommonModule,
    CourseBatchRoutingModule,
    SuiModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [CreateCourseBatchComponent, ViewCourseBatchComponent, UpdateCourseBatchComponent]
})
export class CourseBatchModule { }
