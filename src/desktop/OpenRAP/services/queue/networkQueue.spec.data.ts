const queueListData = [{
  pathToApi: '/api/data/v1/telemetry',
  requestHeaderObj: {
    'Content-Type': 'application/json',
    'Content-Encoding': 'gzip',
    Authorization: 'Bearer aaa'
  },
  requestBody: {
    type: 'Buffer',
    data: [
      31, 139, 8, 0, 0, 0, 0, 0, 0, 3, 237, 88,
      219, 110, 219, 70, 16, 253, 21, 130, 207, 38, 181, 247,
      139, 223, 130, 196, 77, 2, 36, 177, 145, 168, 79, 65,
      80, 236, 101, 104, 179, 165, 73, 149, 164, 220, 166, 129,
      255, 189, 179, 180, 108, 203, 141, 37, 219, 65, 16, 4,
      149, 4, 1, 18, 119, 103, 118, 184, 51, 231, 236, 217,
      221, 47, 249, 56, 228, 135, 84, 106, 203, 21, 213, 70,
      74, 33, 14, 114, 184, 128, 54, 53, 127, 252, 146, 67
    ]
  },
  subType: 'TELEMETRY',
  size: 1298,
  createdOn: 1579361786052,
  updatedOn: 1579361786052,
  type: 'NETWORK',
  priority: 1,
  _id: '41bf363b-1c30-41ab-b5df-a9bc7dd8a185',
  _rev: '3-0313a9a569ffaef29ce8a72fe93428f4'
},
{
  pathToApi: '/api/data/v1/telemetry',
  requestHeaderObj: {
    'Content-Type': 'application/json',
    'Content-Encoding': 'gzip',
    Authorization: 'Bearer aaa'
  },
  requestBody: {
    type: 'Buffer',
    data: [
      31, 139, 8, 0, 0, 0, 0, 0, 0, 3, 237, 88,
      219, 110, 219, 70, 16, 253, 21, 130, 207, 38, 181, 247,
      139, 223, 130, 196, 77, 2, 36, 177, 145, 168, 79, 65,
      80, 236, 101, 104, 179, 165, 73, 149, 164, 220, 166, 129,
      255, 189, 179, 180, 108, 203, 141, 37, 219, 65, 16, 4,
      149, 4, 1, 18, 119, 103, 118, 184, 51, 231, 236, 217,
      221, 47, 249, 56, 228, 135, 84, 106, 203, 21, 213, 70,
      74, 33, 14, 114, 184, 128, 54, 53, 127, 252, 146, 67
    ]
  },
  subType: 'TELEMETRY',
  size: 1298,
  createdOn: 1579361786052,
  updatedOn: 1579361786052,
  type: 'NETWORK',
  priority: 1,
  _id: '41bf363b-1c30-41ab-b5df-a9bc7dd8a18522',
  _rev: '3-0313a9a569ffaef29ce8a72fe93428f422'
},
{
  pathToApi: '/api/data/v1/telemetry',
  requestHeaderObj: {
    'Content-Type': 'application/json',
    'Content-Encoding': 'gzip',
    Authorization: 'Bearer aaa'
  },
  requestBody: {
    type: 'Buffer',
    data: [
      31, 139, 8, 0, 0, 0, 0, 0, 0, 3, 237, 88,
      219, 110, 219, 70, 16, 253, 21, 130, 207, 38, 181, 247,
      139, 223, 130, 196, 77, 2, 36, 177, 145, 168, 79, 65,
      80, 236, 101, 104, 179, 165, 73, 149, 164, 220, 166, 129,
      255, 189, 179, 180, 108, 203, 141, 37, 219, 65, 16, 4,
      149, 4, 1, 18, 119, 103, 118, 184, 51, 231, 236, 217,
      221, 47, 249, 56, 228, 135, 84, 106, 203, 21, 213, 70,
      74, 33, 14, 114, 184, 128, 54, 53, 127, 252, 146, 67
    ]
  },
  subType: 'TELEMETRY',
  size: 1298,
  createdOn: 1579361786052,
  updatedOn: 1579361786052,
  type: 'NETWORK',
  priority: 1,
  _id: '41bf363b-1c30-41ab-b5df-a9bc7dd8a185a',
  _rev: '3-0313a9a569ffaef29ce8a72fe93428f4s'
}];

const errorEvent = {
  context: {
      env: "networkQueue"
  },
  edata: {
      err: "SERVER_ERROR",
      errtype: "SYSTEM",
      stacktrace: 'stack'
  }
}

export {
  queueListData, errorEvent
}