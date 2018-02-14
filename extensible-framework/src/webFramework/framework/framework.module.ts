import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrameworkApiService } from "./framework-api.service";
import { UserService } from './user.service';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data.service';
import { LearnerService } from './learner.service';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    DataService,
    LearnerService,
    UserService,
    FrameworkApiService
  ],
  exports: []
})
export class FrameworkModule { }
