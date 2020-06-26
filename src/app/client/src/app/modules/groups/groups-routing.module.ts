import { WORKSPACE, ADD_MEMBER_TO_GROUP, CREATE_EDIT_GROUP, MY_GROUPS } from './components/routerLinks';
import { MyGroupsComponent, GroupWorkspaceComponent, AddMemberComponent, CreateEditGroupComponent } from './components';
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
      telemetry: { env: telemetryEnv, pageid: MY_GROUPS, type: 'view', subtype: 'paginate' },
      baseUrl: MY_GROUPS
    }
  },

  {path: CREATE_EDIT_GROUP, component: CreateEditGroupComponent},
  {path: WORKSPACE.GROUP_ID, component: GroupWorkspaceComponent },
  {path: ADD_MEMBER_TO_GROUP, component: AddMemberComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
