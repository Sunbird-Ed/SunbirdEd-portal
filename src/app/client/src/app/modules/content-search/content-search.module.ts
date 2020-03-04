import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoResultComponent } from './components';

@NgModule({
  declarations: [NoResultComponent],
  imports: [
    CommonModule
  ],
  exports: [NoResultComponent]
})
export class ContentSearchModule { }
