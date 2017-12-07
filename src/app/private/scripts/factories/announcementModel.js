'use strict'

angular.module('playerApp')
  .factory('AnnouncementModel', function () {
    function Announcement (atts) {
      this.sourceId = atts.sourceid || ''
      this.attachments = atts.attachments || []
      this.createdDate = new Date(atts.createdDate) || null
      this.createdBy = atts.userid || null
      this.description = this.description || atts.description || ''
      this.from = this.from || atts.from || ''
      this.title = this.title || atts.title || ''
      this.type = this.type || atts.type || ''
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
