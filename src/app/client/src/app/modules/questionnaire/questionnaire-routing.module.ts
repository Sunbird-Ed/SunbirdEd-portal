import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { QuestionnaireComponent } from "./questionnaire/questionnaire.component";
import {CanDeactivateGuard} from "./guard/can-deactivate.guard"
const telemetryEnv = "observation";

const routes: Routes = [
  {
    path: "",
    component: QuestionnaireComponent,
    canDeactivate:[CanDeactivateGuard],
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
