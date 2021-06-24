export const courseHierarchy = {
  result: {
    'content': {
      'name': 'ParentCourse',
      'identifier': 'do_21307962614412902412404',
      'description': 'Enter description for Course', 'resourceType': 'Course',
      'collections': [],
      'leafNodes': [
        'do_2127638382202880001645'
      ],
      'contentType': 'Course',
      'contentTypesCount': '{\'CourseUnit\': 2,\'Resource\': 1,\'Course\': 1}',
      'objectType': 'Content',
      'leafNodesCount': 1,
      'mimeTypesCount': '{\'application/vnd.ekstep.content-collection\': 3,\'video/x-youtube\': 1}',
      'childNodes': [
        'do_21307962653118464012405',
        'do_21307962088008908812604',
        'do_2127638382202880001645',
        'do_21307962204779315212605'
      ],
      'children': [
        {
          'parent': 'do_21307962614412902412404',
          'mimeType': 'application/vnd.ekstep.content-collection',
          'objectType': 'Content',
          'children': [
            {
              'mimeType': 'application/vnd.ekstep.content-collection',
              'leafNodes': [
                'do_2127638382202880001645'
              ],
              'objectType': 'Content',
              'collections': [],
              'children': [
                {
                  'ownershipType': [
                    'createdBy'
                  ],
                  'parent': 'do_21307962088008908812604',
                  'mimeType': 'application/vnd.ekstep.content-collection',
                  'objectType': 'Content',
                  'children': [
                    {
                      'ownershipType': [
                        'createdBy'
                      ],
                      'previewUrl': 'https: //www.youtube.com/watch?v=kPJwSgHDSgY',
                      'keywords': [
                        'vrevre'
                      ],
                      'mimeType': 'video/x-youtube',
                      'contentType': 'Resource',
                      'identifier': 'do_2127638382202880001645',
                      'name': 'Content_91',
                      'resourceType': 'Learn'
                    }
                  ],
                  'contentType': 'CourseUnit',
                  'identifier': 'do_21307962204779315212605',
                  'visibility': 'Parent',
                  'index': 1,
                  'mediaType': 'content',
                  'name': 'With Resource',
                  'leafNodesCount': 1,
                  'leafNodes': [
                    'do_2127638382202880001645'
                  ]
                }
              ],
              'contentType': 'Course',
              'identifier': 'do_21307962088008908812604',
              'contentTypesCount': '{\'CourseUnit\': 1,\'Resource\': 1}',
              'childNodes': [
                'do_2127638382202880001645',
                'do_21307962204779315212605'
              ],
              'name': 'NestedCourse',
              'pkgVersion': 1,
              'leafNodesCount': 1,
              'board': 'State (Rajasthan)',
              'resourceType': 'Course',
              'index': 1,
              'parent': 'do_21307962653118464012405'
            }
          ],
          'contentType': 'CourseUnit',
          'identifier': 'do_21307962653118464012405',
          'mediaType': 'content',
          'leafNodesCount': 1,
          'leafNodes': [
            'do_2127638382202880001645'
          ]
        }
      ]
    }
  }
};

export const nestedCourse = [
  {
    'mimeType': 'application/vnd.ekstep.content-collection',
    'leafNodes': [
      'do_2127638382202880001645'
    ],
    'objectType': 'Content',
    'collections': [],
    'contentType': 'Course',
    'identifier': 'do_21307962088008908812604',
    'contentTypesCount': '{\'CourseUnit\': 1,\'Resource\': 1}',
    'childNodes': [
      'do_2127638382202880001645',
      'do_21307962204779315212605'
    ],
    'name': 'NestedCourse',
    'pkgVersion': 1,
    'leafNodesCount': 1,
    'board': 'State (Rajasthan)',
    'resourceType': 'Course',
    'index': 1,
    'parent': 'do_21307962653118464012405'
  },
  {
    'name': 'ParentCourse',
    'identifier': 'do_21307962614412902412404',
    'description': 'Enter description for Course', 'resourceType': 'Course',
    'collections': [],
    'leafNodes': [
      'do_2127638382202880001645'
    ],
    'contentType': 'Course',
    'contentTypesCount': '{\'CourseUnit\': 2,\'Resource\': 1,\'Course\': 1}',
    'objectType': 'Content',
    'leafNodesCount': 1,
    'mimeTypesCount': '{\'application/vnd.ekstep.content-collection\': 3,\'video/x-youtube\': 1}',
    'childNodes': [
      'do_21307962653118464012405',
      'do_21307962088008908812604',
      'do_2127638382202880001645',
      'do_21307962204779315212605'
    ],
  }
];

export const activityData = {
  'activity': {
    'agg': [
      {
        'metric': 'enrolmentCount',
        'lastUpdatedOn': 1594898939615,
        'value': 2
      },
      {
        'metric': 'leafNodesCount',
        'lastUpdatedOn': 1557890515518,
        'value': 10
      }
    ],
    'id': 'do_2125636421522554881918',
    'type': 'Course'
  },
  'groupId': 'ddebb90c-59b5-4e82-9805-0fbeabed9389',
  'members': [
    {
      'role': 'admin',
      'createdBy': '1147aef6-ada5-4d27-8d62-937db8afb40b',
      'name': 'Tarento Mobility  ',
      'userId': '1147aef6-ada5-4d27-8d62-937db8afb40b',
      'status': 'active',
      'agg': [
        {
          'metric': 'completedCount',
          'lastUpdatedOn': 1594898939617,
          'value': 4
        }
      ]
    },
    {
      'role': 'member',
      'createdBy': '0a4300a0-6a7a-4edb-9111-a7c9c6a53693',
      'name': 'Qualitrix Book Reviewer',
      'userId': '9e74d241-004f-40d9-863e-63947ef10bbd',
      'status': 'active',
      'agg': [
        {
          'metric': 'completedCount',
          'lastUpdatedOn': 1594898939617,
          'value': 5
        }
      ]
    }
  ]
};

export const groupData = { activities: [{ id: 'do_1234', activityInfo: { name: 'activity1' } }, { id: 'do_0903232', activityInfo: { name: 'activity2' } }] };
export const content = {
  result: {
    content: {
      'ownershipType': [
        'createdBy'
      ],
      'previewUrl': 'https: //www.youtube.com/watch?v=kPJwSgHDSgY',
      'keywords': [
        'vrevre'
      ],
      'leafNodesCount': 1,
      'mimeType': 'video/x-youtube',
      'contentType': 'Resource',
      'identifier': 'do_2127638382202880001645',
      'name': 'Content_91',
      'resourceType': 'Learn',
    }
  }
};
export const updatedGroupData = {
  id: '83201038-9f23-4a8f-8055-01f79dbf2e20',
  name: 'dashboard testing - kiruba',
  status: 'active',
  updatedBy: 'fca2925f-1eee-4654-9177-fece3fd6afc9',
  updatedOn: '2021-06-16 07: 44: 22: 066+0000',
  active: true,
  createdBy: 'fca2925f-1eee-4654-9177-fece3fd6afc9',
  createdOn: '2021-06-02 05: 16: 02: 646+0000',
  description: '',
  activities: [{
    id: 'do_2132733794265006081401',
    type: 'Course',
    activityInfo: {
      'trackable': {
        'enabled': 'Yes',
        'autoBatch': 'Yes'
      },
      'identifier': 'do_2132733794265006081401',
      'subject': [
        'Mathematics'
      ],
      'channel': '01269878797503692810',
      'downloadUrl': 'https: //sunbirdstagingpublic.blob.core.windows.net/sunbird-content-staging/ecar_files/do_2132733794265006081401/df-course-ks_1620285834979_do_2132733794265006081401_1.0_spine.ecar',
      'organisation': [
        'Tamil Nadu'
      ],
      'language': [
        'English'
      ],
      'mimeType': 'application/vnd.ekstep.content-collection',
      'variants': {
        'online': {
          'ecarUrl': 'https: //sunbirdstagingpublic.blob.core.windows.net/sunbird-content-staging/ecar_files/do_2132733794265006081401/df-course-ks_1620285835152_do_2132733794265006081401_1.0_online.ecar',
          'size': 7226
        },
        'spine': {
          'ecarUrl': 'https: //sunbirdstagingpublic.blob.core.windows.net/sunbird-content-staging/ecar_files/do_2132733794265006081401/df-course-ks_1620285834979_do_2132733794265006081401_1.0_spine.ecar',
          'size': 436146
        }
      },
      'leafNodes': [
        'do_2130256504436408321525',
        'do_2132733254917980161338'
      ],
      'pkgVersion': 1,
      'objectType': 'Content',
      'appIcon': 'https: //sunbirdstagingpublic.blob.core.windows.net/sunbird-content-staging/content/do_2132733794265006081401/artifact/do_2132720061794713601240_1620117942037_4.thumb.jpg',
      'framework': 'tn_k-12_5',
      'size': 436146,
      'primaryCategory': 'Course',
      'createdBy': 'fca2925f-1eee-4654-9177-fece3fd6afc9',
      'leafNodesCount': 2,
      'name': 'DF Course - KS',
      'lastUpdatedOn': '2021-05-06T07: 23: 51.355+0000',
      'contentType': 'Course',
      'status': 'Live',
      'resourceType': 'Course'
    }
  }],
  members: [
    {
      'userId': '08631a74-4b94-4cf7-a818-831135248a4a',
      'groupId': '83201038-9f23-4a8f-8055-01f79dbf2e20',
      'role': 'member',
      'status': 'active',
      'createdOn': '2021-06-02 05:51:15:376+0000',
      'createdBy': 'fca2925f-1eee-4654-9177-fece3fd6afc9',
      'updatedOn': null,
      'updatedBy': null,
      'removedOn': null,
      'removedBy': null,
      'visited': null,
      'name': 'ContentreviewerTN'
    }
  ]
};
