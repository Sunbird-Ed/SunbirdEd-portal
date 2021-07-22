import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UciComponent } from './components/uci/uci.component';
import { UciAdminRoutingModule } from './uci-admin-routing.module';
import {UciModule} from '@samagra-x/uci-console';


@NgModule({
  declarations: [UciComponent],
  imports: [
    UciAdminRoutingModule,
    UciModule
  ]
})
export class UciAdminModule {
}
