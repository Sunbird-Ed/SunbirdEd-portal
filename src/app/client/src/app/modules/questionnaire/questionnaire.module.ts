import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { QuestionnaireComponent } from "./questionnaire/questionnaire.component";
import { QuestionnaireRoutingModule } from "./questionnaire-routing.module";
import { SharedModule } from "@sunbird/shared";

import { InputTypeTextComponent } from "./components/input-type-text/input-type-text.component";
import { InputTypeRangeComponent } from './components/input-type-range/input-type-range.component';
import { InputTypeNumberComponent } from './components/input-type-number/input-type-number.component';
import { InputTypeDatePickerComponent } from './components/input-type-date-picker/input-type-date-picker.component';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SuiModule } from "ng2-semantic-ui";
import { InputTypeRadioComponent } from './components/input-type-radio/input-type-radio.component';
import { InputTypeCheckboxComponent } from './components/input-type-checkbox/input-type-checkbox.component';
import { PageQuestionsComponent } from './components/page-questions/page-questions.component';
import { MatrixQuestionsComponent } from './components/matrix-questions/matrix-questions.component';
import { QuestionGenericInputsComponent } from './components/question-generic-inputs/question-generic-inputs.component';
import { QuestionnaireService } from "./questionnaire.service";
import { RemarksComponent } from './components/remarks/remarks.component';

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
  
  ],
  imports: [
    CommonModule,
    SharedModule,
    QuestionnaireRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SuiModule
  ],
  providers:[]
})
export class QuestionnaireModule {}
