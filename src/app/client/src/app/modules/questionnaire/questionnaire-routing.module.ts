import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { QuestionnaireComponent } from "./questionnaire/questionnaire.component";
const telemetryEnv = "observation";

const routes: Routes = [
  {
    path: "",
    component: QuestionnaireComponent,
    data: {
      telemetry: {
        env: telemetryEnv,
        pageid: "questionnaire",
        type: "view",
      },
    },
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionnaireRoutingModule {}
