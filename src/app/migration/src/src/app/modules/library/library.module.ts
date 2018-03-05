import { LibraryRoutingModule } from './library-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceComponent } from './component/index';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui/dist';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    LibraryRoutingModule,
    SharedModule,
    SuiModule,
    FormsModule
  ],
  declarations: [ResourceComponent]
})
export class LibraryModule { }
