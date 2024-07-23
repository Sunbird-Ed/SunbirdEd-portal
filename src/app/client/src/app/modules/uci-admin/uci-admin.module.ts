import { CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { UciComponent } from './components/uci/uci.component';
import { UciAdminRoutingModule } from './uci-admin-routing.module';
import {UciModule} from 'uci-console-v16';


@NgModule({
  declarations: [UciComponent],
  imports: [
    UciAdminRoutingModule,
    UciModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class UciAdminModule {
}
