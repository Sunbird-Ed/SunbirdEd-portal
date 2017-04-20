/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Helper for MediaModel
 *
 * @author rayulu
 */
var mongoose = require('mongoose'), 
fs = require('fs');
var MWServiceProvider = require('./MWServiceProvider');
var promise_lib = require('when');
var IDCacheUtil = require('./IDCacheUtil');
var ViewHelperUtil = require('./ViewHelperUtil');

exports.getAllMedia = function(req, res) {
	MediaModel = mongoose.model('MediaModel');
	MediaModel.find().lean().exec(function(err, mediaItems) {
		if (err) {
			errorModule.handleError(err, "ERROR_FINDING_CONTENT_ITEMS", req, res);
		} else {
			res.send(JSON.stringify(mediaItems));
		}
	});
};

exports.updateMediaTitle = function(mediaId, title) {
	MediaModel = mongoose.model('MediaModel');
	MediaModel.findOne({
		identifier : mediaId
	}).exec(function(err, media) {
		if (err) {
			console.log('failed to get media object', err.request.options);
		} else {
			media.title = title;
			media.save(function(err, object) {
				if (err) {
					console.log('failed to update media object', err.request.options);
				} else {
					console.log('media object updated');
					// call set media info
				}
			});
		}
	});
};

exports.createMedia = function(mediaFrom, tmpFilePath, title, tmpServer, mimeType, mediaType, contentType) {
	var errors = [];
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		var deferred = promise_lib.defer();
		if(mediaFrom == 'FILE') {
			fs.readFile(tmpFilePath, function(err, data) {
				if(err) {
					console.log('failed to read file',err.request.options);
					deferred.reject(err);
				} else {
					var fileData = data;
					var tmpMediaId = (new Date().getTime()) + "-" + title;
					fs.writeFile('public/temp/' + tmpMediaId, data, function(err) {
						if (err) {
				            console.log('failed to write file to temp location', err.request.options);
				            deferred.reject(err);	
						} else {
							var url = tmpServer + "/temp/" + tmpMediaId;
							deferred.resolve({"url": url, "fileData": fileData});
						}
					});
				}
			});	
		} else if(mediaFrom == 'URL') {
			deferred.resolve({"url": tmpFilePath});
		}
		return deferred.promise;	
	})
	.then(function(data) {
		var url = data.url;
		var fileData = data.fileData;
		console.log("URL:"+url);
		var deferred = promise_lib.defer();
		prepareMedia(mediaFrom, url, fileData, title, mimeType, mediaType, contentType, function(media) {
			deferred.resolve(media);
		}, function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	})
	.catch (function(err) {
        console.log("Error:"+err);
        errors = err;
    })
	.done(function(media) {
		if(errors.length > 0) {
			deferred.reject(errors);
		} else {
			deferred.resolve(media);	
		}
	});

	return deferred.promise;
}

function prepareMedia(mediaFrom, url, fileData, title, mimeType, mediaType, contentType, callback, errorCallback) {
	var errors = [];
	promise_lib.resolve()
	.then(function(){return IDCacheUtil.getIdentifier()})
	.then(function(identifier) {
		console.log("Iden:"+identifier);
		var deferred = promise_lib.defer();
		MediaModel = mongoose.model('MediaModel');
		var media = new MediaModel();
		media.identifier = identifier;
		media.title = title;
		media.fileName = title;
		media.mediaType = mediaType;
		media.mimeType = mimeType; // For a URL we don't know mimeType so, using mediaType as mimetype.
		media.contentType = contentType;
		media.url = url;
		if(mediaFrom == 'URL') {
			media.state = 'READY';
		} else {
			media.state = 'NEW';			
		}		
		media.save(function(err, object) {
			if (err) {
				console.log("Error: "+err);
				deferred.reject(err);
			} else {
				deferred.resolve(object);
			}
		});
		return deferred.promise;
	})
	.then(function(media) {
		var reqJSON = new Object();
		reqJSON.CONTENTTYPE = contentType;
		reqJSON.MEDIATYPE = mediaType;
		reqJSON.TITLE = title;
		reqJSON.MEDIAID = media.identifier;
		if(mediaFrom == 'URL') {
			reqJSON.MEDIAURL = url;
		}
		MWServiceProvider.callService("MWService", "createMedia", JSON.stringify(reqJSON), function(data, response) {
			console.log("Media Object Created...");
			var obj = JSON.parse(data);
			console.log("MediaInfo:"+JSON.stringify(obj));
			// console.log("MediaInfo State:"+JSON.stringify(obj.responseValueObjects.MEDIAINFO.baseValueMap.state));
 			var state = obj.responseValueObjects.MEDIAINFO.baseValueMap.state[0];
 			// console.log("Media Status:"+status);
 			media.state = state;
 			media.save();
			if(mediaFrom == 'FILE') {
				uploadMedia(fileData, media);	
			}
		});
		return media;
	})
	.catch (function(err) {
        console.log("Error:"+err);
        errors = err;
    })
    .done(function(media) {
        if(errors.length > 0) {
            errorCallback(errors);
        } else {
            callback(media);
        }
    });
}

function uploadMedia(fileData, media) {
	var errors = [];
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		// var deferred = promise_lib.defer();
		// uploadMediaToFedora(media, fileData, function(data) {
		// 	console.log("Media Uploaded...");
		// 	deferred.resolve();
		// });	
		//return deferred.promise;	
		return uploadMediaToFedora(media, fileData);
	})
	.catch(function(err) {
		errors = err;
	})
	.done();
}

exports.updateContentMediaState = function(content, callback) {
	var errors = [];
	MediaModel = mongoose.model('MediaModel');
	var promises = [];
	var deferred = promise_lib.defer();
	promise_lib.resolve()
	.then(function() {
		for (var i = 0; i < content.media.length; i++) {
			promises.push(exports.getMedia(content.media[i].mediaId));
		}
		return promise_lib.all(promises);
	})
	.then(function(mediaItems) {
		if(mediaItems && mediaItems.length > 0) {
			content.media = [];
			for (var i = 0; i < mediaItems.length; i++) {
				var updatedMedia = new Object();
				updatedMedia.title = mediaItems[i].title;
				updatedMedia.mediaUrl = mediaItems[i].url;
				updatedMedia.mediaType = mediaItems[i].mediaType;
				updatedMedia.mediaId = mediaItems[i].identifier;
				updatedMedia.mimeType = mediaItems[i].mimeType;
				updatedMedia.state = mediaItems[i].state;
				if(i==0){
					updatedMedia.isMain = true;
				} else {
					updatedMedia.isMain = false;
				}
				content.media.push(updatedMedia);
			};
			content.save(function(err, data) {
				if(err) {
					deferred.reject(err);
				} else {
					deferred.resolve(data);
				}
			});
		} else {
			deferred.resolve(content);
		}
		return deferred.promise;
	})
	.done(function(data) {
		callback(data);
	});
};

exports.getMedia = function(mediaId) {
	var errors = [];
	var deferred = promise_lib.defer();
	MediaModel = mongoose.model('MediaModel');
	promise_lib.resolve()
	.then(function() {
		return {'identifier' : mediaId};
	})
	.then(ViewHelperUtil.promisify(MediaModel.findOne, MediaModel))
	.then(function(media) {
		var deferred = promise_lib.defer();
		if(media.state) {
			if(media.state == 'NEW' || media.state == 'UPLOADED') {
				var req = new Object();
				req.MEDIAID = mediaId;
				MWServiceProvider.callService("MWService", "getMediaInfo", JSON.stringify(req), function(data, response) {
					var obj = JSON.parse(data);
					var mediaFromFedora = obj.responseValueObjects.MEDIAINFO.baseValueMap;
					if(mediaFromFedora.state[0] == 'READY') {
						media.state = mediaFromFedora.state[0];
						if(mediaFromFedora.mediaURL[0] && mediaFromFedora.mediaURL[0].length > 0) {
							media.url = mediaFromFedora.mediaURL[0];	
						}
						media.save(function(err, object){
							if(err) {
								deferred.reject(err);
							} else {
								deferred.resolve(object);
							}
						});
					} else {
						deferred.resolve(media);
					}
				});
			} else {
				deferred.resolve(media);
			}
		} 
		return deferred.promise;
	})
	.catch (function(err) {
        console.log("Error:"+err);
        errors = err;
    })
    .done(function(media) {
        if(errors.length > 0) {
            console.log('fialed to update media state',errors);
            deferred.reject(err);
        } else {
            deferred.resolve(media);
        }
    });
    return deferred.promise;
};

exports.createMediaWithURL = function(url, title, mediaType, contentType, callback, errCallback) {
	var reqJSON = new Object();
	reqJSON.CONTENTTYPE = contentType;
	reqJSON.MEDIATYPE = mediaType;
	reqJSON.TITLE = title;
	MWServiceProvider.callService("MWService", "createMedia", JSON.stringify(reqJSON), function(data, response) {
		try {
		    var obj = JSON.parse(data);
		    var mediaId = obj.responseValueObjects.MEDIAID.id;
		    MediaModel = mongoose.model('MediaModel');
			var media = new MediaModel();
			media.identifier = mediaId;
			media.title = title;
			media.fileName = title;
			media.mediaType = mediaType;
			//media.mimeType = mediaType; // For a URL we don't know mimeType so, using mediaType as mimetype.
			media.contentType = contentType;
			media.url = url;
			media.save(function(err, object) {
				if (err) {
					if (!errCallback) {
		            	console.log('failed to create media object', err.request.options);	
		            } else {
		            	errCallback('ERROR_CREATING_MEDIA', err);
		            }
				} else {
					callback(media);
				}
			});
		} catch (e) {
			if (!errCallback) {
            	console.log('failed to create media object', e);	
            } else {
            	errCallback('ERROR_CREATING_MEDIA', e);
            }
		}
	});
}

exports.updateMediaURL = function(mediaId, callback, errCallback) {
	var req = new Object();
	req.MEDIAID = mediaId;
	MWServiceProvider.callService("MWService", "getMediaInfo", JSON.stringify(req), function(data, response) {
		try {
			var info = JSON.parse(data);
			var mediaInfo = info.responseValueObjects.MEDIAINFO.baseValueMap;
			var url = mediaInfo.mediaURL;
			if (url && url != '') {
				MediaModel = mongoose.model('MediaModel');
				MediaModel.findOne({
					identifier : mediaId
				}).exec(function(err, media) {
					if (err) {
						if (!errCallback) {
							console.log('Media object not found');	
			            } else {
			            	errCallback('ERROR_MEDIA_NOT_FOUND');
			            }
					} else {
						var tmpURL = media.tmpURL;
						media.url = url;
						media.tmpURL = '';
						media.save(function(err, object) {
							if (err) {
								if (!errCallback) {
									console.log('error setting media url');	
					            } else {
					            	errCallback('ERROR_SETTING_MEDIA_URL');
					            }
							} else {
								if (tmpURL && tmpURL != '') {
									var idx = tmpURL.indexOf("temp/");
									var tmpPath = 'public/' + tmpURL.substring(idx, tmpURL.length);
									fs.unlinkSync(tmpPath);
								}
								callback(media);
							}
						});
					}
				});
			} else {
				callback();
			}
		} catch (e) {
			if (!errCallback) {
				console.log('failed to get media info', e);	
            } else {
            	errCallback('ERROR_MEDIA_NOT_FOUND');
            }
		}
	});
};

// function uploadMediaToFedora(media, fileData, callback) {
// 	var mediaStream = new Buffer(fileData).toString('base64');
// 	var req = new Object();
// 	req.MEDIAID = media.identifier;
// 	req.MEDIASTREAM = mediaStream;
// 	req.FILENAME = media.title;
// 	req.MIMETYPE = media.mimeType;
// 	MWServiceProvider.callService("MWService", "uploadMedia", JSON.stringify(req), function(data, response) {
// 		console.log('media upload complete');
// 		var obj = JSON.parse(data);
// 		if(obj.responseValueObjects) {
// 			// console.log("MediaInfo:"+JSON.stringify(obj.responseValueObjects.MEDIAINFO.baseValueMap));
// 			// console.log("MediaInfo State:"+JSON.stringify(obj.responseValueObjects.MEDIAINFO.baseValueMap.state));
// 			var state = obj.responseValueObjects.MEDIAINFO.baseValueMap.state[0];
// 			// console.log("Media Status:"+status);
// 			media.state = state;
// 			if(state=='READY') {
// 				var url = obj.responseValueObjects.MEDIAINFO.baseValueMap.mediaURL[0];
// 				media.url = url;
// 			}

// 			media.save();
// 			callback('media uploaded');
// 		}
// 	});
// }

function uploadMediaToFedora(media, fileData) {

	var errors = [];
	var mediaStream = new Buffer(fileData).toString('base64');
	var req = new Object();
	req.MEDIAID = media.identifier;
	req.MEDIASTREAM = mediaStream;
	req.FILENAME = media.title;
	req.MIMETYPE = media.mimeType;
	var deferred = promise_lib.defer();
    MWServiceProvider.callServiceStandard("MWService", "uploadMedia", JSON.stringify(req), function(err, data, response) {
    	//console.log("Error:",err);
    	console.log("Data:",data);
    	//console.log("Response:",response);
        if (err) {
            console.log(err);
            dererred.reject(err);
        } else {
        	var obj = JSON.parse(data);        	
        	if(obj.errors.length == 0) {
	        	// console.log("MediaInfo:"+JSON.stringify(obj.responseValueObjects.MEDIAINFO.baseValueMap));
				// console.log("MediaInfo State:"+JSON.stringify(obj.responseValueObjects.MEDIAINFO.baseValueMap.state));
				var state = obj.responseValueObjects.MEDIAINFO.baseValueMap.state[0];
				// console.log("Media Status:"+status);
				media.state = state;
				if(state=='READY') {
					var url = obj.responseValueObjects.MEDIAINFO.baseValueMap.mediaURL[0];
					media.url = url;
				}

				media.save();
				console.log("media uploaded");
				deferred.resolve(data);
        	} else {
        		deferred.reject(obj.errors);
        	}

        }
    });
    return deferred.promise;

}