import { LearnRoutingModule } from './learn-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { SlickModule } from 'ngx-slick';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LearnPageComponent, CoursePlayerComponent, CourseConsumptionHeaderComponent,
  CourseConsumptionPageComponent, BatchDetailsComponent, EnrollBatchComponent, CreateBatchComponent,
   UpdateBatchComponent } from './components';
import { CourseConsumptionService, CourseBatchService } from './services';
import { CoreModule } from '@sunbird/core';
import { DiscussionModule } from '@sunbird/discussion';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SuiModule,
    SlickModule,
    FormsModule,
    LearnRoutingModule,
    CoreModule,
    DiscussionModule
  ],
  providers: [CourseConsumptionService, CourseBatchService],
  declarations: [LearnPageComponent, CoursePlayerComponent, CourseConsumptionHeaderComponent,
    CourseConsumptionPageComponent, BatchDetailsComponent, EnrollBatchComponent, CreateBatchComponent, UpdateBatchComponent]
})
export class LearnModule { }
