import { SharedModule } from '@sunbird/shared';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContributeRoutingModule } from './contribute-routing.module';
import { ListAllProgramsComponent } from './components';

@NgModule({
  declarations: [ListAllProgramsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ContributeRoutingModule
  ]
})
export class ContributeModule { }
