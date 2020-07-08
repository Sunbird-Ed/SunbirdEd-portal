import { WORKSPACE, ADD_MEMBER_TO_GROUP, CREATE_GROUP, MY_GROUPS, ADD_ACTIVITY_TO_GROUP, ACTIVITY_DETAILS, COURSES } from './interfaces';
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
    },
    children: [
      { path: CREATE_GROUP, component: CreateEditGroupComponent }
    ]
  },
  {
    path: WORKSPACE.GROUP_ID, component: GroupDetailsComponent,
    children: [
      { path: CREATE_GROUP, component: CreateEditGroupComponent },
    ]
  },
  { path: ADD_MEMBER_TO_GROUP, component: AddMemberComponent },
  { path: `${WORKSPACE.GROUP_ID}/${ADD_ACTIVITY_TO_GROUP}/${COURSES}/:pageNumber`, component: ActivitySearchComponent },
  { path: `${WORKSPACE.GROUP_ID}/${ACTIVITY_DETAILS}/:activityId`, component: ActivityDashboardComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
