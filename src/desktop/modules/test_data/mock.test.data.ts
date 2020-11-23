import { env } from './routes.spec.data';
export const location_state = {
        result: {
            response: [
                {
                    'code': '1',
                    'name': 'test_state_11',
                    'id': '4a6d77a1-6653-4e30-9be8-93371b6b53b78',
                    'type': 'state'
                  },
                  {
                    'code': '2',
                    'name': 'test_state_12',
                    'id': 'f1fe9665-bf2e-43cd-9063-57b0f33014b4',
                    'type': 'state'
                  },
                  {
                    'code': '3',
                    'name': 'test_state_13',
                    'id': 'f62a597d-17bd-499e-9565-734e3d556231',
                    'type': 'state'
                  },
                  {
                    'code': '4',
                    'name': 'test_state_14',
                    'id': 'f62a597d-17bd-499e-9565-734e3d556267',
                    'type': 'state'
                  }
                ]
    }
}
export const location_state_empty = {
    result: {
        response: [
            ]
}
}

export const location_district = {
    result: {
        response: [
              {
                "code": "2907",
                "name": "test_district_1",
                "id": "cde02789-5803-424b-a3f5-10db347280e9",
                "type": "district",
                "parentId": "4a6d77a1-6653-4e30-9be8-93371b6b53b78"
              },
              {
                "code": "2909",
                "name": "test_district_2",
                "id": "3ac37fb2-d833-45bf-a579-a2656b0cce62",
                "type": "district",
                "parentId": "4a6d77a1-6653-4e30-9be8-93371b6b53b78"
              }
            ]
}
}
export const location_district_empty = {
    result: {
        response: [
            ]
}
}
export const appUpdate = {
  termsOfUseUrl: `${env.APP_BASE_URL}/term-of-use.html`,
  deviceId: '687476',
  languages: 'English, Hindi',
  releaseDate: '16 December 2019',
  updateInfo: {
    updateAvailable: true,
    url: 'https://localhost:9000/app_updated.dmg',
    version: '1.0.2'
  }
}
export const not_updated = {
  termsOfUseUrl: `${env.APP_BASE_URL}/term-of-use.html`,
  deviceId: '687476',
  languages: 'English, Hindi',
  releaseDate: '16 December 2019',
  updateInfo: {
    updateAvailable: false,
  }
}
export const app_update_error = {
  'id': 'api.desktop.update',
  'ver': '1.0',
  'ts': '2019-10-25T09:39:51.560Z',
  'params': {
    'resmsgid': '9652a082-9677-4ccf-91e9-f138fd80c410',
    'msgid': 'c246387b-a3a6-4a98-b150-73b1bbab7665',
    'status': 'failed',
    'err': 'ERR_INTERNAL_SERVER_ERROR',
    'errmsg': 'Error while processing the request'
  },
  'responseCode': 'INTERNAL_SERVER_ERROR',
  'result': {
    'deviceId': '1234',
    'languages': "English, Hindi",
    'releaseDate': '16 December 2019'
  }
}
export const get_content_error = { id: 'api.content.read',
ver: '1.0',
ts: '2020-03-06T13:14:16.174Z',
params: 
 { resmsgid: 'a8e8b2b5-fe29-4322-afa6-a6fde3bd89f2',
   msgid: 'cd8d9ec1-9fd2-4164-b48e-a7d6b906050f',
   status: 'failed',
   err: 'ERR_DATA_NOT_FOUND',
   errmsg: 'Data not found' },
responseCode: 'RESOURCE_NOT_FOUND',
result: {} }
