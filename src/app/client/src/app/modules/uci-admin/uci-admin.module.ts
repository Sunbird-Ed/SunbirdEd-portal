import { NgModule} from '@angular/core';
import { UciComponent } from './components/uci/uci.component';
import { UciAdminRoutingModule } from './uci-admin-routing.module';
// import {UciModule} from '@samagra-x/uci-console'; //commented for infinte-scroll


@NgModule({
  declarations: [UciComponent],
  imports: [
    UciAdminRoutingModule,
    // UciModule //commented for infinte-scroll
  ]
})
export class UciAdminModule {
}
