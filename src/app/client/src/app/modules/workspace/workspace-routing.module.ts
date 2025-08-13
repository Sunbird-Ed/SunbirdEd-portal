import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  WorkspaceComponent, CreateContentComponent, DraftComponent,
  ReviewSubmissionsComponent, PublishedComponent, CollectionEditorComponent, ContentEditorComponent,
  GenericEditorComponent, UploadedComponent, DataDrivenComponent, FlaggedComponent, UpForReviewComponent,
  BatchListComponent, BatchPageSectionComponent, UpdateBatchComponent,
  UpforreviewContentplayerComponent, ReviewsubmissionsContentplayerComponent,
  FlagConentplayerComponent, PublishedPopupComponent, RequestChangesPopupComponent, LimitedPublishedComponent,
  AllContentComponent, FlagReviewerComponent, CollaboratingOnComponent, AllTextbooksComponent, NewCollectionEditorComponent, SkillMapComponent, SkillMapEditorComponent } from './components';
import { AuthGuard } from '../core/guard/auth-gard.service';
const telemetryEnv = 'workspace';
const objectType = 'workspace';
const routes: Routes = [
  {
    path: 'content', component: WorkspaceComponent, canActivate: [AuthGuard], data: { roles: 'workspace' },
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
                env: telemetryEnv, pageid: 'workspace-create-course', subtype: 'paginate', uri: '/workspace/content/create/course',
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
          },
          {
            path: 'assessment', component: DataDrivenComponent,
            data: {
              telemetry: {
                env: telemetryEnv, pageid: 'workspace-create-assessment', subtype: 'paginate', uri: '/workspace/content/create/assessment',
                type: 'view', mode: 'create', object: { type: objectType, ver: '1.0' }
              }, breadcrumbs: [{ label: 'Home', url: '/home' },
              { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
            }
          },
          {
            path: 'practice_assessment', component: DataDrivenComponent,
            data: {
              telemetry: {
                env: telemetryEnv, pageid: 'workspace-create-practice-assessment', subtype: 'paginate', uri: '/workspace/content/create/practice_assessment',
                type: 'view', mode: 'create', object: { type: objectType, ver: '1.0' }
              }, breadcrumbs: [{ label: 'Home', url: '/home' },
              { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
            }
          },
          {
            path: 'questionset', component: DataDrivenComponent,
            data: {
              telemetry: {
                env: telemetryEnv, pageid: 'workspace-create-questionset', uri: '/workspace/content/create/questionset',
                type: 'view', mode: 'create', object: { type: objectType, ver: '1.0' }
              }, breadcrumbs: [{ label: 'Home', url: '/home' },
              { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
            }
          }
        ]
      },
      {
        path: 'edit/collection/:contentId/:type/:state/:framework/:contentStatus',
          component: CollectionEditorComponent, canActivate: [AuthGuard],
        data: { roles: 'workspace' }
      },
      {
        path: 'edit/content/:contentId/:state/:framework/:contentStatus', component: ContentEditorComponent,
        canActivate: [AuthGuard], data: { roles: 'workspace' }
      },
      {
        path: 'edit/generic', component: GenericEditorComponent,
        canActivate: [AuthGuard], data: { roles: 'workspace' }
      },
      {
        path: 'edit/generic/:contentId/:state/:framework/:contentStatus', component: GenericEditorComponent,
        canActivate: [AuthGuard], data: { roles: 'workspace' }
      },
      {
        path: 'edit/editorforlargecontent', component: GenericEditorComponent,
        canActivate: [AuthGuard], data: { roles: 'workspace' , isLargeFileUpload: true }
      },
      {
        path: 'edit/collection/:contentId/:type/:state/:framework',
          component: CollectionEditorComponent, canActivate: [AuthGuard],
        data: { roles: 'workspace' }
      },
      {
        path: 'edit/content/:contentId/:state/:framework', component: ContentEditorComponent,
        canActivate: [AuthGuard], data: { roles: 'workspace' }
      },
      {
        path: 'edit/generic/:contentId/:state/:framework', component: GenericEditorComponent,
        canActivate: [AuthGuard], data: { roles: 'workspace' }
      },
      {
        path: 'draft/:pageNumber', component: DraftComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-draft', subtype: 'paginate', uri: '/workspace/content/draft',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'draftRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'review/:pageNumber', component: ReviewSubmissionsComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-inreview', subtype: 'paginate', uri: '/workspace/content/review',
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
            env: telemetryEnv, pageid: 'workspace-content-uploaded', subtype: 'paginate', uri: '/workspace/content/uploaded',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'alluploadsRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'flagged/:pageNumber', component: FlaggedComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-flagged', subtype: 'paginate', uri: 'workspace/content/flagged',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'flaggedRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'upForReview/:pageNumber', component: UpForReviewComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-upforreview', subtype: 'paginate', uri: 'workspace/content/upForReview',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'upForReviewRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'limited-publish/:pageNumber', component: LimitedPublishedComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-unlisted', subtype: 'paginate', uri: '/workspace/content/limited-publish',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'limitedPublishingRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'batches/:category', component: BatchPageSectionComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-course-batch', subtype: 'paginate', uri: '/workspace/batches',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'courseBatchRoles',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        },
        children: [{
          path: 'update/batch/:batchId', component: UpdateBatchComponent, canActivate: [AuthGuard],
          data: {
            telemetry: {
              env: telemetryEnv, pageid: 'batch-edit', uri: '/update/batch/',
              type: 'detail', mode: 'create', object: { type: objectType, ver: '1.0' }
            }, roles: 'courseBatchRoles',
            breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
          }
        }]
      },
      {
        path: 'allcontent/:pageNumber', component: AllContentComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-allcontent', subtype: 'paginate', uri: 'workspace/content/allcontent',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'allContentRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'alltextbooks/:pageNumber', component: AllTextbooksComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-alltextbooks', subtype: 'paginate', uri: 'workspace/content/alltextbooks',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'alltextbookRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'flagreviewer/:pageNumber', component: FlagReviewerComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-flagreviewer', subtype: 'paginate', uri: 'workspace/content/flagreviewer',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'flagReviewerRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'collaborating-on/:pageNumber', component: CollaboratingOnComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-collaborating-on',
      subtype: 'paginate', uri: 'workspace/content/collaborating-on',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'collaboratingRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'skillmap/:pageNumber', component: SkillMapComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-skillmap', subtype: 'paginate', uri: 'workspace/content/skillmap',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'skillmapRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'skillmap-reviewer/:pageNumber', component: SkillMapComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-skillmap-reviewer', subtype: 'paginate', uri: 'workspace/content/skillmap-reviewer',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'skillmapReviewerRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      }
    ]
  },
  {
    path: 'content/skillmap/edit/:contentId', component: SkillMapEditorComponent, canActivate: [AuthGuard],
    data: {
      telemetry: {
        env: telemetryEnv, pageid: 'workspace-content-skillmap-editor', uri: 'workspace/content/skillmap/edit',
        type: 'edit', mode: 'create', object: { type: objectType, ver: '1.0' }
      }, roles: 'skillmapReviewerRole',
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '/workspace/content/skillmap/1' }, { label: 'Skill Map Editor', url: '' }],
      hideHeaderNFooter: true
    }
  },
  {
    path: 'content/skillmap/edit/:contentId', component: SkillMapEditorComponent, canActivate: [AuthGuard],
    data: {
      telemetry: {
        env: telemetryEnv, pageid: 'workspace-content-skillmap-editor', uri: 'workspace/content/skillmap/edit',
        type: 'edit', mode: 'create', object: { type: objectType, ver: '1.0' }
      }, roles: 'skillmapRole',
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '/workspace/content/skillmap/1' }, { label: 'Skill Map Editor', url: '' }],
      hideHeaderNFooter: true
    }
  },
  {
    path: 'edit/:type/:contentId/:state/:contentStatus', component: NewCollectionEditorComponent, canActivate: [AuthGuard],
    data: {
      roles: 'workspace',
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }],
      hideHeaderNFooter: true
    }
  },
  {
    path: 'content/upForReview/content/:contentId', component: UpforreviewContentplayerComponent, canActivate: [AuthGuard],
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
    path: 'content/flagreviewer/content/:contentId', component: UpforreviewContentplayerComponent, canActivate: [AuthGuard],
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
    path: 'content/flag/content/:contentId', component: FlagConentplayerComponent, canActivate: [AuthGuard],
    data: {
      roles: 'workspace',
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
    }
  },
  {
    path: 'content/review/content/:contentId', component: ReviewsubmissionsContentplayerComponent, canActivate: [AuthGuard],
    data: {
      roles: 'workspace',
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
    }
  },
  {
    path: 'batches/view-all/:section/:pageNumber', component: BatchListComponent, canActivate: [AuthGuard],
    data: {
      telemetry: {
        env: telemetryEnv, pageid: 'view-all', subtype: 'paginate', uri: '/workspace/content/batches/view-all',
        type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
      }, roles: 'courseBatchRoles',
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
    },
    children: [{
      path: 'update/batch/:batchId', component: UpdateBatchComponent, canActivate: [AuthGuard],
      data: {
        telemetry: {
          env: telemetryEnv, pageid: 'batch-edit', uri: '/update/batch/',
          type: 'detail', mode: 'create', object: { type: objectType, ver: '1.0' }
        }, roles: 'courseBatchRoles',
        breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
      }
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }


