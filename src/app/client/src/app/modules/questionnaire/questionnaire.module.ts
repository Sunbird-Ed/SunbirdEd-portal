import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { QuestionnaireRoutingModule } from './questionnaire-routing.module';
import { SharedModule, ResourceService } from '@sunbird/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CanDeactivateGuard } from './guard/can-deactivate.guard';
import {
  SlQuestionnaireModule, 
  SlTranslateService,
} from '@shikshalokam/sl-questionnaire';

@NgModule({
  declarations: [QuestionnaireComponent],
  imports: [
    CommonModule,
    SharedModule,
    QuestionnaireRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SlQuestionnaireModule,
  ],
  providers: [
    CanDeactivateGuard,
    {
      provide: SlTranslateService,
      useClass: ResourceService,
    },
  ],
})
export class QuestionnaireModule {}
