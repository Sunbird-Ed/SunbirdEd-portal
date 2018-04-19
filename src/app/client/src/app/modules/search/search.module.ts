import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { SearchRoutingModule } from './search-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseSearchComponent } from './components/index';
@NgModule({
  imports: [
    CommonModule,
    SearchRoutingModule,
    SharedModule,
    SuiModule,
    FormsModule,
    CoreModule
  ],
  declarations: [CourseSearchComponent]
})
export class SearchModule { }
