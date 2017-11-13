var announcementTestData = {
  getAnnouncementInbox: {
    successResponce: { "id": "api.plugin.announcement.user.outbox", "ver": "1.0", "ts": "2017-11-10 05:39:01:536+0000", "params": { "resmsgid": "74bf5200-c5d9-11e7-a6fc-2788fac1f270", "msgid": null, "status": "successful", "err": "", "errmsg": "" }, "responseCode": "OK", "result": { "count": 1, "announcements": [{ "sourceId": "0123673908687093760", "createddate": "2017-11-05 13:38:40:569+0530", "details": { "description": "Test description for announcement 11", "from": "test user", "type": "Circular", "title": "Test title for announcement 11" }, "links": ["http://google.com"], "id": "0fb94a9a-c521-11e7-abc4-cec278b6b50a", "userid": "d56a1766-e138-45e9-bed2-a0db5eb9696a", "status": "active", "target": { "geo": { "ids": ["0123668622585610242", "0123668627050987529"] } } }] } }
  },
  getAnnouncementOutbox: {
    successResponce: { "id": "api.plugin.announcement.user.outbox", "ver": "1.0", "ts": "2017-11-10 05:39:01:536+0000", "params": { "resmsgid": "74bf5200-c5d9-11e7-a6fc-2788fac1f270", "msgid": null, "status": "successful", "err": "", "errmsg": "" }, "responseCode": "OK", "result": { "count": 1, "announcements": [{ "sourceId": "0123673908687093760", "createddate": "2017-11-05 13:38:40:569+0530", "details": { "description": "Test description for announcement 11", "from": "test user", "type": "Circular", "title": "Test title for announcement 11" }, "links": ["http://google.com"], "id": "0fb94a9a-c521-11e7-abc4-cec278b6b50a", "userid": "d56a1766-e138-45e9-bed2-a0db5eb9696a", "status": "active", "target": { "geo": { "ids": ["0123668622585610242", "0123668627050987529"] } } }] } }
  },
  announcementDetails: {
    annValidObj: { 'sourceId': 'Org-Id', 'createdOn': 'Date', 'type': 'Org-Type', 'links': ['WebLink1'], 'title': 'Title', 'description': 'Description', 'attachments': [{ 'title': 'AttachementTitle1', 'downloadURL': 'AttachementDownloadURL1', 'filesize': '120 KB' }] },
    annBlankObj: {},
    annObjWithEmptyWeblinks: { 'links': [], 'title': 'Title'},
    annObjWithEmptyAttachments: { 'title': 'Title', 'attachments': [] }
  },
  deleteAnnoucement: {
    successResponse: {"id":"api.plugin.announcement.cancel.id","ver":"1.0","ts":"2017-11-11 09:58:09:409+0530","params":{"resmsgid":"b8b22220-c698-11e7-bff5-9ffed44487d9","msgid":null,"status":"successful","err":"","errmsg":""},"responseCode":"OK","result":{"id":"9cfc4c90-c616-11e7-92f6-c50322845811","status":"cancelled"}}
  },
  resendAnnouncement:{
    successResponse: {"id":"api.plugin.announcement.resend","ver":"1.0","ts":"2017-11-12 05:53:22:130+0000","params":{"resmsgid":"ca873230-c76d-11e7-8175-573a15bbe3f0","msgid":null,"status":"successful","err":"","errmsg":""},"responseCode":"OK","result":{"announcement":{"id":"ca7c83d0-c76d-11e7-8175-573a15bbe3f0"}}}
  },
  getResend:{
    successResponse: {"id":"api.plugin.announcement.getresend.id","ver":"1.0","ts":"2017-11-12 06:45:50:882+0000","params":{"resmsgid":"1f547820-c775-11e7-a0fa-0d6c238048d7","msgid":null,"status":"successful","err":"","errmsg":""},"responseCode":"OK","result":{"sourceid":"0123673908687093760","createddate":"2017-11-10 11:59:54:879+0530","details":{"description":"Test description for announcement 87","from":"test user","title":"Test title for announcement 87","type":"Circular"},"links":["http://yahoo.com"],"id":"90ae7cf0-c5e0-11e7-8744-852d6ada097c","userid":"d56a1766-e138-45e9-bed2-a0db5eb9696a","target":{"geo":{"ids":["0123668622585610242","0123668627050987529"]}},"status":"cancelled"}}
  }
}
