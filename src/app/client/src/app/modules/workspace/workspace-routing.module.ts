import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  WorkspaceComponent, CreateContentComponent, DraftComponent,
  ReviewSubmissionsComponent, PublishedComponent, CollectionEditorComponent, ContentEditorComponent,
  GenericEditorComponent, UploadedComponent, DataDrivenComponent, FlaggedComponent, UpForReviewComponent,
  BatchListComponent, UpdateBatchComponent, UpforreviewContentplayerComponent, ReviewsubmissionsContentplayerComponent,
  FlagConentplayerComponent, PublishedPopupComponent, RequestChangesPopupComponent, LimitedPublishedComponent,
  AllContentComponent} from './components';
import { AuthGuard } from '../core/guard/auth-gard.service';
const telemetryEnv = 'workspace';
const objectType = 'workspace';
const routes: Routes = [
  {
    path: 'workspace/content', component: WorkspaceComponent, canActivate: [AuthGuard], data: { roles: 'workspace' },
    children: [
      {
        path: 'create', component: CreateContentComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-create', uri: '/workspace/content/create',
            type: 'view', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'createRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        },
        children: [
          {
            path: 'textbook', component: DataDrivenComponent,
            data: {
              telemetry: {
                env: telemetryEnv, pageid: 'workspace-create-textbook', uri: '/workspace/content/create/textbook',
                type: 'view', mode: 'create', object: { type: objectType, ver: '1.0' }
              }, breadcrumbs: [{ label: 'Home', url: '/home' },
              { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
            }
          },
          {
            path: 'uploadcontent', component: DataDrivenComponent,
            data: {
              telemetry: {
                env: telemetryEnv, pageid: 'workspace-content-create', subtype: 'paginate', uri: '/workspace/content/create',
                type: 'view', mode: 'create', object: { type: objectType, ver: '1.0' }
              }, breadcrumbs: [{ label: 'Home', url: '/home' },
              { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
            }
          },
          {
            path: 'course', component: DataDrivenComponent,
            data: {
              telemetry: {
                env: telemetryEnv, pageid: 'worksapce-create-course', subtype: 'paginate', uri: '/workspace/content/create/course',
                type: 'view', mode: 'create', object: { type: objectType, ver: '1.0' }
              }, breadcrumbs: [{ label: 'Home', url: '/home' },
              { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
            }
          },
          {
            path: 'studymaterial', component: DataDrivenComponent,
            data: {
              telemetry: {
                env: telemetryEnv, pageid: 'workspace-create-lesson', subtype: 'paginate', uri: '/workspace/content/create/studymaterial',
                type: 'view', mode: 'create', object: { type: objectType, ver: '1.0' }
              }, breadcrumbs: [{ label: 'Home', url: '/home' },
              { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
            }
          },
          {
            path: 'collection', component: DataDrivenComponent,
            data: {
              telemetry: {
                env: telemetryEnv, pageid: 'workspace-create-collection', subtype: 'paginate', uri: '/workspace/content/create/collection',
                type: 'view', mode: 'create', object: { type: objectType, ver: '1.0' }
              }, breadcrumbs: [{ label: 'Home', url: '/home' },
              { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
            }
          },
          {
            path: 'lessonplan', component: DataDrivenComponent,
            data: {
              telemetry: {
                env: telemetryEnv, pageid: 'workspase-create-lessonplan', subtype: 'paginate', uri: '/workspace/content/create/lessonplan',
                type: 'view', mode: 'create', object: { type: objectType, ver: '1.0' }
              }, breadcrumbs: [{ label: 'Home', url: '/home' },
              { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
            }
          }
        ]
      },
      { path: 'edit/collection/:contentId/:type/:state/:framework', component: CollectionEditorComponent },
      { path: 'edit/content/:contentId/:state/:framework', component: ContentEditorComponent },
      { path: 'edit/generic', component: GenericEditorComponent },
      { path: 'edit/generic/:contentId/:state/:framework', component: GenericEditorComponent },
      {
        path: 'draft/:pageNumber', component: DraftComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-draft', subtype: 'scroll', uri: '/workspace/content/draft',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'draftRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'review/:pageNumber', component: ReviewSubmissionsComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-inreview', subtype: 'scroll', uri: '/workspace/content/review',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'inreviewRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'published/:pageNumber', component: PublishedComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-published', uri: '/workspace/content/published',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'publishedRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'uploaded/:pageNumber', component: UploadedComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-uploaded', subtype: 'scroll', uri: '/workspace/content/uploaded',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'alluploadsRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'flagged/:pageNumber', component: FlaggedComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-flagged', subtype: 'scroll', uri: 'workspace/content/flagged',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'flaggedRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'upForReview/:pageNumber', component: UpForReviewComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-upforreview', subtype: 'scroll', uri: 'workspace/content/upForReview',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'upForReviewRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'limited/publish/:pageNumber', component: LimitedPublishedComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-unlisted', subtype: 'scroll', uri: '/workspace/content/limited/publish',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'limitedPublishingRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'batches/:pageNumber', component: BatchListComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-course-batch', subtype: 'scroll', uri: '/workspace/batches',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'coursebacthesRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'update/batch/:batchId', component: UpdateBatchComponent,
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'batch-edit', uri: '/update/batch/',
            type: 'detail', mode: 'create', object: { type: objectType, ver: '1.0' }
          }
        }
      },
      { path: 'update/batch/:batchId', component: UpdateBatchComponent },
      {
        path: 'allcontent/:pageNumber', component: AllContentComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-allcontent', subtype: 'scroll', uri: 'workspace/content/allcontent',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'allContentRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      // { path: '**', redirectTo: 'create' }
    ]
  },
  {
    path: 'workspace/content/upForReview/content/:contentId', component: UpforreviewContentplayerComponent, canActivate: [AuthGuard],
    data: {
      roles: 'workspace',
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
    },
    children: [
      { path: 'publish', component: PublishedPopupComponent },
      { path: 'requestchanges', component: RequestChangesPopupComponent }
    ]
  },
  {
    path: 'workspace/content/flag/content/:contentId', component: FlagConentplayerComponent, canActivate: [AuthGuard],
    data: {
      roles: 'workspace',
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
    }
  },
  {
    path: 'workspace/content/review/content/:contentId', component: ReviewsubmissionsContentplayerComponent, canActivate: [AuthGuard],
    data: {
      roles: 'workspace',
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }


