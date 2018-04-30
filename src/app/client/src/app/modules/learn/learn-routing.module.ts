import { LearnPageComponent, ContentPlayerComponent } from './components';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'learn', component: LearnPageComponent,
  },
  {
    path: 'play-content/:contentId', component: ContentPlayerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnRoutingModule { }
