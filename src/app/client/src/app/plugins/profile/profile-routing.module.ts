import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  ProfilePageComponent,
  CreateUserComponent,
  ChooseUserComponent,
  SubmitTeacherDetailsComponent,
  DeleteUserComponent
} from './components';
const telemetryEnv = 'profile';
const objectType = 'profile';
const routes: Routes = [
  {
    path: '', component: ProfilePageComponent,
    data: {
      menuBar: {
        visible: false
      },
      pageTitle: 'profile',
      telemetry: {
        env: telemetryEnv, type: 'view', mode: 'create', subtype: 'paginate', object: { type: objectType, ver: '1.0' }
      }, breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '' }]
    }
  },
  {
    path: 'create-managed-user', component: CreateUserComponent,
    data: {
      menuBar: {
        visible: false
      },
      pageTitle: 'create-managed-user',
      telemetry: {
        env: telemetryEnv, type: 'view'
      }
    }
  },
  {
    path: 'delete-user', component: DeleteUserComponent,
    data: {
      menuBar: {
        visible: false
      },
      pageTitle: 'delete-user',
      telemetry: {
        env: telemetryEnv, type: 'view'
      }
    }
  },
  {
    path: 'choose-managed-user', component: ChooseUserComponent,
    data: {
      menuBar: {
        visible: false
      },
      telemetry: {
        env: telemetryEnv, pageid: 'choose-managed-user', type: 'view',
        uri: '/profile/choose-managed-user',
      }
    }
  },
  {
    path: 'submit-declaration', component: SubmitTeacherDetailsComponent,
    data: {
      menuBar: {
        visible: false
      },
      telemetry: {
        env: telemetryEnv, pageid: 'teacher-declaration', type: 'view',
        uri: '/profile/submit-declaration',
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
