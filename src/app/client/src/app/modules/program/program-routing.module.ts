// Import modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// Import component
import { ProgramComponent} from './component';
const telemetryEnv = 'home';
const objectType = 'home';
const routes: Routes = [
  {
    path: '',
   component: ProgramComponent
 }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProgramRoutingModule { }
