import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QuestionnaireComponent } from "./questionnaire/questionnaire.component";
import { QuestionnaireRoutingModule } from "./questionnaire-routing.module";
import { SharedModule } from "@sunbird/shared";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SuiModule } from "ng2-semantic-ui";
import {
  InputTypeAttachmentComponent, InputTypeCheckboxComponent, InputTypeDatePickerComponent, InputTypeNumberComponent,
  InputTypeRadioComponent, InputTypeRangeComponent, InputTypeTextComponent, PageQuestionsComponent, MatrixQuestionsComponent, QuestionGenericInputsComponent,
  RemarksComponent
} from './components';
import { ObservationUtilService } from "../observation/service";
import {CanDeactivateGuard} from "./guard/can-deactivate.guard"

@NgModule({
  declarations: [
    QuestionnaireComponent,
    InputTypeTextComponent,
    InputTypeRangeComponent,
    InputTypeNumberComponent,
    InputTypeDatePickerComponent,
    InputTypeRadioComponent,
    InputTypeCheckboxComponent,
    PageQuestionsComponent,
    MatrixQuestionsComponent,
    QuestionGenericInputsComponent,
    RemarksComponent,
    InputTypeAttachmentComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    QuestionnaireRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SuiModule
  ],
  providers:[ObservationUtilService,CanDeactivateGuard]

})
export class QuestionnaireModule { }
