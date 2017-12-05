'use strict'

angular.module('playerApp')
  .factory('AnnouncementModel', function () {
    function Announcement (atts) {
      this.sourceId = atts.sourceid || ''
      this.attachments = atts.attachments || []
      this.createdDate = new Date(atts.createddate) || null
      this.createdBy = atts.userid || null
      this.details = atts.details || {}
      this.details.description = this.details.description || ''
      this.details.from = this.details.from || ''
      this.details.title = this.details.title || ''
      this.details.type = this.details.type || ''
      this.links = atts.links || []
      this.id = atts.id || ''
      this.target = atts.target || {}
      this.target.geo = this.target.geo || {}
      this.target.geo.ids = this.target.geo.ids || []
      this.status = atts.status || null
    }
    return {
      Announcement: Announcement
    }
  })
