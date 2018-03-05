import { LibraryRoutingModule } from './library-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceComponent } from './component/index';
import { SharedModule } from '@sunbird/shared';
import { SuiModule } from 'ng2-semantic-ui';
@NgModule({
  imports: [
    CommonModule,
    LibraryRoutingModule,
    SharedModule,
    SuiModule
  ],
  declarations: [ResourceComponent]
})
export class LibraryModule { }
