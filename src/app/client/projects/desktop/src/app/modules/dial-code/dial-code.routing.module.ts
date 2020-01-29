import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DesktopDialCodeSearchComponent } from './desktop-dial-code-search/desktop-dial-code-search.component';


const routes: Routes = [
  {
    path: 'dial/:dialCode', component: DesktopDialCodeSearchComponent, data: {
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
  export class DialCodeRoutingModule { }
