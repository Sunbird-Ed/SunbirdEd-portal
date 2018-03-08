// Import modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
// Import component
import { MainHomeComponent } from './component/index';


const routes: Routes = [
  {
    path: 'home',
    component: MainHomeComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
