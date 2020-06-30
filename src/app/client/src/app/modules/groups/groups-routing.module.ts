import { WORKSPACE, ADD_MEMBER_TO_GROUP, CREATE_EDIT_GROUP, MY_GROUPS, ADD_ACTIVITY_TO_GROUP, ACTIVITY_DETAILS } from './components/routerLinks';
import {
  MyGroupsComponent, AddMemberComponent, GroupDetailsComponent,
  CreateEditGroupComponent, ActivitySearchComponent, ActivityDashboardComponent
} from './components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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

  { path: CREATE_EDIT_GROUP, component: CreateEditGroupComponent },
  { path: WORKSPACE.GROUP_ID, component: GroupDetailsComponent },
  { path: ADD_MEMBER_TO_GROUP, component: AddMemberComponent },
  { path: `${ADD_ACTIVITY_TO_GROUP}/:pageNumber`, component: ActivitySearchComponent },
  { path: `${ACTIVITY_DETAILS}/:activityId`, component: ActivityDashboardComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
