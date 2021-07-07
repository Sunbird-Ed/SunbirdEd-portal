import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UciComponent } from './components/uci/uci.component';
import { UciAdminRoutingModule } from './uci-admin-routing.module'



@NgModule({
  declarations: [UciComponent],
  imports: [
    UciAdminRoutingModule
  ]
})
export class UciAdminModule { }
