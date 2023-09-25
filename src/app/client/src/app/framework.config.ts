import { OfflinePlugins } from './modules/public/module/offline/plugin';
import { OfflineModule } from './modules/public/module/offline/';

export const WebExtensionsConfig = {
  plugins: [
    {
    'id': 'offline-plugins',
    'ver': '1.0.0',
    'module': OfflineModule,
    'main': OfflinePlugins
  }
]
};

export const PluginModules = [ OfflineModule ];

export const TaxonomyCategories = ['taxonomyCategory1', 'taxonomyCategory2', 'taxonomyCategory3', 'taxonomyCategory4'];

export const taxonomyEnvironment = {
  production: false,
  url: '',
  token: '',
  frameworkName: 'tarento_fw',
  channelId: 'tarento',
  authToken: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI0WEFsdFpGMFFhc1JDYlFnVXB4b2RvU2tLRUZyWmdpdCJ9.mXD7cSvv3Le6o_32lJplDck2D0IIMHnv0uJKq98YVwk',
  userToken:'',
  isApprovalRequired: false
};

export const taxonomyConfig = [
  {
      "frameworkId" :"compass_fw",
      "config" : [
          {   
              "index": 1,
              "category": "board",
              "icon": "settings",
              "color": "#1d2327"
          },
          {   
              "index": 2,
              "category": "medium",
              "icon": "extension",
              "color": "#541675"
          },
          {   
              "index": 3,
              "category": "gradeLevel",
              "icon": "bar_chart",
              "color": "#9a6c80"
          },
          {   
              "index": 4,
              "category": "subject",
              "icon": "account_box",
              "color": "#d8666a"
          }
      ]
  },
  {
      "frameworkId" :"tarento_fw",
      "config" : [
          {   
              "index": 1,
              "category": "taxonomyCategory1",
              "icon": "settings",
              "color": "#1d2327"
          },
          {   
              "index": 2,
              "category": "taxonomyCategory2",
              "icon": "extension",
              "color": "#541675"
          },
          {   
              "index": 3,
              "category": "taxonomyCategory3",
              "icon": "bar_chart",
              "color": "#9a6c80"
          },
          {   
              "index": 4,
              "category": "taxonomyCategory4",
              "icon": "account_box",
              "color": "#d8666a"
          }
      ]
  },
  {
    "frameworkId" :"gov_fw",
    "config" : [
        {   
            "index": 1,
            "category": "taxonomyCategory1",
            "icon": "settings",
            "color": "#1d2327"
        },
        {   
            "index": 2,
            "category": "taxonomyCategory2",
            "icon": "extension",
            "color": "#541675"
        },
        {   
            "index": 3,
            "category": "taxonomyCategory3",
            "icon": "bar_chart",
            "color": "#9a6c80"
        }
    ]
  },
  {
    "frameworkId" :"fracing_fw",
    "config" : [
        {   
            "index": 1,
            "category": "taxonomyCategory1",
            "icon": "settings",
            "color": "#1d2327"
        },
        {   
            "index": 2,
            "category": "taxonomyCategory2",
            "icon": "extension",
            "color": "#541675"
        },
        {   
            "index": 3,
            "category": "taxonomyCategory3",
            "icon": "bar_chart",
            "color": "#9a6c80"
        },
        {   
            "index": 4,
            "category": "taxonomyCategory4",
            "icon": "account_box",
            "color": "#d8666a"
        },
        {   
            "index": 5,
            "category": "taxonomyCategory5",
            "icon": "bar_chart",
            "color": "#ed8699"
        }
    ]
  }

]