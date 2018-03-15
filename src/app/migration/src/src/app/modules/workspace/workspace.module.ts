import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkspaceRoutingModule } from './workspace-routing.module';
import { WorkspaceComponent } from './components';
import { WorkspacesidebarComponent } from './components/workspacesidebar/workspacesidebar.component';
import { CreateContentComponent } from './components/create-content/create-content.component';

@NgModule({
  imports: [
    CommonModule,
    WorkspaceRoutingModule
  ],
  declarations: [WorkspaceComponent, WorkspacesidebarComponent, CreateContentComponent]
})
export class WorkspaceModule { }
