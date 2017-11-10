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
  }
}
