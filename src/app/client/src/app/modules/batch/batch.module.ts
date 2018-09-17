
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BatchRoutingModule } from './batch-routing.module';
import { CreateComponent, AddMembersComponent , ViewComponent} from './components';
@NgModule({
  imports: [
    CommonModule,
    BatchRoutingModule
  ],
  declarations: [CreateComponent, AddMembersComponent, ViewComponent]
})
export class BatchModule { }
