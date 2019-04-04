import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscussionComponent } from './component';
import { CourseDiscussService } from './services';
import { DiscussionService } from './services';
import {HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [CourseDiscussService, DiscussionService],
  exports: [DiscussionComponent],
  declarations: [DiscussionComponent]
})
export class DiscussionModule { }
