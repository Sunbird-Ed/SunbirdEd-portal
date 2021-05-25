import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QuestionnaireComponent } from "./questionnaire/questionnaire.component";
import { QuestionnaireRoutingModule } from "./questionnaire-routing.module";
import { SharedModule } from "@sunbird/shared";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SuiModule } from "ng2-semantic-ui";
import { QuestionnaireService } from "./questionnaire.service";
import {
  InputTypeAttachmentComponent, InputTypeCheckboxComponent, InputTypeDatePickerComponent, InputTypeNumberComponent,
  InputTypeRadioComponent, InputTypeRangeComponent, InputTypeTextComponent, PageQuestionsComponent, MatrixQuestionsComponent, QuestionGenericInputsComponent
} from './components';

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
  providers: []
})
export class QuestionnaireModule { }
