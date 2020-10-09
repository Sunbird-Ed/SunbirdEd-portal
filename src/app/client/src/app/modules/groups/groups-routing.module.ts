import { WORKSPACE, ADD_MEMBER_TO_GROUP, CREATE_GROUP, MY_GROUPS,
  ADD_ACTIVITY_TO_GROUP, ACTIVITY_DETAILS, COURSES, GROUP_DETAILS, ADD_MEMBER,
  ADD_ACTIVITY_CONTENT_TYPES, EDIT_GROUP} from './interfaces';
import {
  MyGroupsComponent, AddMemberComponent, GroupDetailsComponent,
  CreateEditGroupComponent, ActivitySearchComponent, ActivityDashboardComponent, AddActivityContentTypesComponent
} from './components';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const telemetryEnv = 'groups';
const type = 'view';
const subtype = 'paginate';
const routes: Routes = [
  {
    path: '', component: MyGroupsComponent,
    data: {
      telemetry: { env: telemetryEnv, pageid: MY_GROUPS, type: type },
      baseUrl: MY_GROUPS
    },
    children: [
      {
        path: CREATE_GROUP, component: CreateEditGroupComponent,
        data: {
          telemetry: { env: telemetryEnv, pageid: CREATE_GROUP, type: type, subtype: subtype },
        },
      },
    ],
  },
  {
    path: WORKSPACE.GROUP_ID, component: GroupDetailsComponent,
    data: {
      telemetry: { env: telemetryEnv, pageid: GROUP_DETAILS, type: type, subtype: subtype },
    },
    children: [
      {
        path: EDIT_GROUP, component: CreateEditGroupComponent,
        data: {
          telemetry: { env: telemetryEnv, pageid: CREATE_GROUP, type: type, subtype: subtype },
        },
      },
    ],
  },
  {
    path: ADD_MEMBER_TO_GROUP, component: AddMemberComponent,
    data: {
      telemetry: { env: telemetryEnv, pageid: ADD_MEMBER, type: type, subtype: subtype },
    },
  },
  {
    path: `${WORKSPACE.GROUP_ID}/${ACTIVITY_DETAILS}/:activityId`, component: ActivityDashboardComponent,
    data: {
      telemetry: { env: telemetryEnv, pageid: ACTIVITY_DETAILS, type: type, subtype: subtype },
    },
  },
  {
    path: `${WORKSPACE.GROUP_ID}/${ADD_ACTIVITY_CONTENT_TYPES}`, component: AddActivityContentTypesComponent,
    data: {
      telemetry: { env: telemetryEnv, pageid: ADD_ACTIVITY_CONTENT_TYPES, type: type, subtype: subtype },
    },
  },
  {
    path: `${WORKSPACE.GROUP_ID}/${ADD_ACTIVITY_CONTENT_TYPES}/${ADD_ACTIVITY_TO_GROUP}/:activityType/:pageNumber`,
    component: ActivitySearchComponent,
    data: {
      telemetry: { env: telemetryEnv, pageid: ADD_ACTIVITY_TO_GROUP, type: type, subtype: subtype },
    },
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
