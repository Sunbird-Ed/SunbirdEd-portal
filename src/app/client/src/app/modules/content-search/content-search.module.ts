import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoResultComponent, SearchProminentFilterComponent, SearchFilterComponent } from './components';
import { SharedModule } from '@sunbird/shared';

@NgModule({
  declarations: [NoResultComponent, SearchProminentFilterComponent, SearchFilterComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [NoResultComponent, SearchProminentFilterComponent, SearchFilterComponent]
})
export class ContentSearchModule { }
