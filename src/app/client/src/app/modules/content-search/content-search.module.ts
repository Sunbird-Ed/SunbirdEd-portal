import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoResultComponent, SearchProminentFilterComponent, SearchFilterComponent } from './components';

@NgModule({
  declarations: [NoResultComponent, SearchProminentFilterComponent, SearchFilterComponent],
  imports: [
    CommonModule
  ],
  exports: [NoResultComponent, SearchProminentFilterComponent, SearchFilterComponent]
})
export class ContentSearchModule { }
