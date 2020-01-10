import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GetComponent } from './components/get/get.component';
import { DialCodeComponent } from './components/dial-code/dial-code.component';

const routes: Routes = [
  {
    path: '', component: GetComponent, data: {
      sendUtmParams: true,
      telemetry: {
        env: 'public', pageid: 'get', type: 'view', subtype: 'paginate'
      }
    }
  },
  {
    path: 'dial/:dialCode', component: DialCodeComponent, data: {
      sendUtmParams: true,
      telemetry: {
        env: 'public', pageid: 'get-dial', type: 'view', subtype: 'pre-populate'
      }
    }
  }];
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class DialCodeSearchRoutingModule { }
