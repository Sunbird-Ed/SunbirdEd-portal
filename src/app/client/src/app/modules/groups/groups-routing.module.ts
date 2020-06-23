import { MyGroupsComponent, GroupWorkspaceComponent, AddMemberComponent } from './components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/guard/auth-gard.service';
const telemetryEnv = 'Groups';
const objectType = 'Groups';
const routes: Routes = [
  {
    path: '', component: MyGroupsComponent,
    data: {
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Groups', url: '' }],
      telemetry: { env: telemetryEnv, pageid: 'my-groups', type: 'view', subtype: 'paginate' },
      baseUrl: 'my-groups'
    }
  },
  {path: 'group-details/:groupId', component: GroupWorkspaceComponent },
  {path: 'group-details/:groupId/add-member-to-group', component: AddMemberComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
