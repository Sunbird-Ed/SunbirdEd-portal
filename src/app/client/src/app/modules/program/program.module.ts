import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProgramRoutingModule } from './program-routing.module'
import { ListAllProgramsComponent } from './components';

@NgModule({
  declarations: [ListAllProgramsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ProgramRoutingModule
  ]
})
export class ProgramModule { }
