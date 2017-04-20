CoursePlayer = {
	dataJson: {},
	selectedDuration: 0,
	view: function(courseId) {
		if(MustacheTemplate.loaded) {
			CoursePlayer._view(courseId);
		} else {
			setTimeout(function() {CoursePlayer.view(courseId)}, 100);
		}
	},
	_view: function(courseId) {
		$.post('php/courseFunctions.php', "do=getCourse&courseId=" + courseId, function(data) {
			$('#courseHeaderDiv').append($(Mustache.render(MustacheTemplate.getTemplate('courseHeaderTile_enroll'), data)));
			$('#courseIntroDiv').append($(Mustache.render(MustacheTemplate.getTemplate('courseIntroTile'), data)));
			CoursePlayer.enhanceEnrollJson(data);
			$('#units_list').append($(Mustache.render(MustacheTemplate.getTemplate('course_enroll_unit'), data)));
			$('.equalheight').equalHeights();  
			$('i').tooltip({html: true});
		},"json");
	},
	enhanceEnrollJson: function(data) {
		$.each(data.units, function(idx, unit) {
			var dur = 0;
			$.each(unit.lessons, function(idx, lesson) {
				dur += CoursePlayer.getMinutes(lesson.duration);
				if(lesson.type == 'coaching') {
					lesson.isCoaching = true;
				}
				if(lesson.content_to_opt && lesson.content_to_opt.length > 0) {
					lesson.hasContentToOpt = true;
					$.each(lesson.content_to_opt, function(idx, content) {
						CoursePlayer.setIconType(content);
					});
				}
			});
			CoursePlayer.selectedDuration += dur;
			unit.duration = CoursePlayer.getTime(dur);
		});
		$('#selectedDuration').html('&nbsp;' + CoursePlayer.getTime(CoursePlayer.selectedDuration));
	},
	getMinutes: function(duration) {
		var arr = duration.split(':');
		return parseInt(arr[0]) * 60 + parseInt(arr[1]);
	},
	getTime: function(minutes) {
		var min = minutes % 60;
		var hr = Math.floor(minutes / 60);
		return (hr < 10 ? '0' + hr : hr) + ":" + (min < 10 ? '0' + min : min);
	},
	selectContent: function(duration, checkboxObj) {
		var dur = CoursePlayer.getMinutes(duration);
		if(checkboxObj.checked) {
			CoursePlayer.selectedDuration += dur;
		} else {
			CoursePlayer.selectedDuration -= dur;
		}
		$('#selectedDuration').html('&nbsp;' + CoursePlayer.getTime(CoursePlayer.selectedDuration));
	},
	changeAspirations: function(selObj) {
		console.log(selObj);
		var arr = $(selObj).val();
		$('.asp_chkbox').each(function() {
			if($(this).is(':checked')) {
				$(this).trigger('click');
			}
		});
		if(arr) {
			$.each(arr, function(idx, id) {
				$('.asp_chkbox').each(function() {
					if($(this).data('asp') == id) {
						$(this).trigger('click');
					}
				});
			});
		}
	},
	showCoursePage: function(url) {
		if(MustacheTemplate.loaded) {
			CoursePlayer._showCoursePage(url);
		} else {
			setTimeout(function() {CoursePlayer.showCoursePage(url)}, 100);
		}
	},
	_showCoursePage: function(url) {
		$.getJSON(url, function(data) {
			var $timeline = $('#timelineDiv');
			$.each(data.units, function(idx, unit) {
				$timeline.append($(Mustache.render(MustacheTemplate.getTemplate('course_timeline_unit'), unit)));
				$.each(unit.lessons, function(idx, lesson) {
					$timeline.append($(Mustache.render(MustacheTemplate.getTemplate('course_timeline_lesson'), lesson)));
					if(lesson.contents && lesson.contents.length > 0) {
						$div = $('<div/>').addClass('list-group lesson-list-group collapse').attr('id', 'lesson' + lesson.index);
						$timeline.append($div);
						$.each(lesson.contents, function(idx, content) {
							CoursePlayer.setIconType(content);
							$div.append($(Mustache.render(MustacheTemplate.getTemplate('course_timeline_content'), content)));
						});
					}
				});
			});
			/*var currIndex = data.currentIndex;
			var arr = currIndex.split('~');
			if(arr[0] == 'unit') {
				$('.unitLink' + arr[1]).trigger('click');
			} else {
				$('.lessonLink' + arr[1]).trigger('click');
			}*/
			$('.equalheight').equalHeights();
			var svg = d3.select('#sunburstCourse').append("svg").attr("width",
					width).attr("height", height).append("g").attr("transform",
					"translate(" + width / 2 + "," + height * .52 + ")");
			d3.json("json/algorithmsObjectiveMap.json", function(error, root) {
				createSunburst(error, root, svg);
			});
		});
	},
	showCourse: function(courseId) {
		if(MustacheTemplate.loaded) {
			CoursePlayer._showCourse(courseId);
		} else {
			setTimeout(function() {CoursePlayer._showCourse(courseId)}, 100);
		}
	},
	_showCourse: function(courseId) {
		$.post('php/courseFunctions.php', "do=getCourseInstance&courseId=" + courseId, function(data) {
			CoursePlayer.dataJson = CoursePlayer.processCourseJSON(data);
			$('#course_header_tile').html($(Mustache.render(MustacheTemplate.getTemplate('course_header_tile'), data)));
			$('#tutor_header_tile').html($(Mustache.render(MustacheTemplate.getTemplate('tutor_header_tile'), data)));
			var $timeline = $('#timelineDiv');
			var currIndex = '';
			$.each(data.units, function(idx, unit) {
				$timeline.append($(Mustache.render(MustacheTemplate.getTemplate('course_timeline_unit'), unit)));
				$.each(unit.lessons, function(idx, lesson) {
					if(lesson.status != 2 && currIndex == '') {
						currIndex = lesson.index;
					}
					$timeline.append($(Mustache.render(MustacheTemplate.getTemplate('course_timeline_lesson'), lesson)));
					/*if(lesson.contents && lesson.contents.length > 0) {
						$div = $('<div/>').addClass('list-group lesson-list-group collapse').attr('id', 'lesson' + lesson.index);
						$timeline.append($div);
						$.each(lesson.contents, function(idx, content) {
							content.icon_type = (content.media_type == 'video' ? 'icon-facetime-video' : (content.media_type == 'text' ? 'icon-file-text' : 'icon-volume-up'));
							$div.append($(Mustache.render(MustacheTemplate.getTemplate('course_timeline_content'), content)));
						});
					}*/
				});
			});
			
			CoursePlayer.showCourseSummary();
			Common.initSideToggleMenu();
			if(currIndex != '') {
				$('.lessonLink' + currIndex).trigger('click');
			}
		}, "json");
	},
	processCourseJSON: function(data) {
		var totalDuration = 0, totalTS = 0, completed = 0;
		$.each(data.units, function(idx, unit) {
			var unitDur = 0, unitTS = 0;
			$.each(unit.lessons, function(idx, lesson) {
				var lessDur = 0, lessonTS = CoursePlayer.getMinutes(lesson.time_spent);
				CoursePlayer.setIconType(lesson);
				$.each(lesson.contents, function(idx, content) {
					lessDur += CoursePlayer.getMinutes(content.duration);
					CoursePlayer.setIconType(content);
				});
				unitDur += lessDur;
				unitTS += lessonTS;
				lesson.duration = CoursePlayer.getTime(lessDur);
				completed += (lesson.progress_perct * lessDur)/100;
			});
			totalDuration += unitDur;
			totalTS += unitTS;
			unit.duration = CoursePlayer.getTime(unitDur);
			unit.time_spent = CoursePlayer.getTime(unitTS);
		});
		data.duration = CoursePlayer.getTime(totalDuration);
		data.time_spent = CoursePlayer.getTime(totalTS);
		data.pending_duration = CoursePlayer.getTime(parseInt(totalDuration - completed));
		return data;
	},
	showCourseSummary: function() {
		
		var data = CoursePlayer.dataJson;
		var coaching_content = {};
		var tutoring_content = {};
		var supp_content = {};
		var practice_content = {};
		
		// Collecting all recommendations...
		CoursePlayer.collectRecommendations(data, coaching_content, tutoring_content, supp_content, practice_content);
		$.each(data.units, function(idx, unit) {
			CoursePlayer.collectRecommendations(unit, coaching_content, tutoring_content, supp_content, practice_content);
			$.each(unit.lessons, function(idx, lesson) {
				CoursePlayer.collectRecommendations(lesson, coaching_content, tutoring_content, supp_content, practice_content);
				if(lesson.contents) {
					$.each(lesson.contents, function(idx, content) {
						CoursePlayer.collectRecommendations(content, coaching_content, tutoring_content, supp_content, practice_content);
					});
				}
			});
		});
		CoursePlayer.setProficiency(data);
		CoursePlayer.checkRecommendations(data);
		CoursePlayer.populateRecommendations(data, 'coaching_content', coaching_content);
		CoursePlayer.populateRecommendations(data, 'tutoring_content', tutoring_content);
		CoursePlayer.populateRecommendations(data, 'supp_content', supp_content);
		CoursePlayer.populateRecommendations(data, 'practice_items', practice_content);
		
		$('#displayPanelGroup').html($(Mustache.render(MustacheTemplate.getTemplate('course_summary'), data)));
		if(data.introductionVideo) {
			var videoId = 'course_intro_video';
			$('#course_intro_video_div').html('<video id="course_intro_video" class="video-js vjs-default-skin pull-left"></video>');
			var json = data.introductionVideo;
			if(json.type == 'youtube') {
				videojs(videoId, { "controls": true, "autoplay": false, "preload": "auto", "width":"100%", "height":"400px", 
				"techOrder": ["youtube"], "src": json.url, "poster": json.poster});
			} else {
				videojs(videoId, { "controls": true, "autoplay": false, "preload": "auto", "width":"100%", "height":"400px", "poster": Media.server + json.poster});
				videojs(videoId).src({ type: json.type, src: Media.server + json.url });
			}
		}
		var svg = d3.select('#sunburstCourse').append("svg").attr("width",
				width).attr("height", height).append("g").attr("transform",
				"translate(" + width / 2 + "," + height * .52 + ")");
		d3.json("json/algorithmsObjectiveMap.json", function(error, root) {
			createSunburst(error, root, svg);
		});
		CoursePlayer.resize();
	},
	showUnitSummary: function(unitId) {
		
		var data = CoursePlayer.dataJson;
		var coaching_content = {};
		var tutoring_content = {};
		var supp_content = {};
		var practice_content = {};
		var sub_tut_content = new Array();
		var unit = {};
		
		$.each(data.units, function(idx, unitJson) {
			if(unitJson.id == unitId) {
				unit = unitJson;
			}
		});
		
		// Collecting all recommendations...
		CoursePlayer.collectRecommendations(unit, coaching_content, tutoring_content, supp_content, practice_content);
		$.each(unit.lessons, function(idx, lesson) {
			CoursePlayer.collectRecommendations(lesson, coaching_content, tutoring_content, supp_content, practice_content);
			if(lesson.contents) {
				$.each(lesson.contents, function(idx, content) {
					CoursePlayer.collectRecommendations(content, coaching_content, tutoring_content, supp_content, practice_content);
					if(content.type == 'tutoring') {
						sub_tut_content[sub_tut_content.length] = content;
					}
				});
			}
		});
		
		if(sub_tut_content.length > 0) {
			unit.has_sub_tut_content = true;
			unit.sub_tut_content = sub_tut_content;
		}
		CoursePlayer.setProficiency(unit);
		CoursePlayer.checkRecommendations(unit);
		CoursePlayer.populateRecommendations(unit, 'coaching_content', coaching_content);
		CoursePlayer.populateRecommendations(unit, 'tutoring_content', tutoring_content);
		CoursePlayer.populateRecommendations(unit, 'supp_content', supp_content);
		CoursePlayer.populateRecommendations(unit, 'practice_items', practice_content);
		
		$('#displayPanelGroup').html($(Mustache.render(MustacheTemplate.getTemplate('unit_summary'), unit)));
		CoursePlayer.resize();
	},
	showLessonSummary: function(lessonId) {

		var data = CoursePlayer.dataJson;
		var coaching_content = {};
		var tutoring_content = {};
		var supp_content = {};
		var practice_content = {};
		var lesson = {};
		
		$.each(data.units, function(idx, unit) {
			$.each(unit.lessons, function(idx, lsj) {
				if(lsj.id == lessonId) {
					lesson = lsj;
				}
			});
		});
		
		var poster_message = '';
		if(lesson.contents) {
			$.each(lesson.contents, function(idx, content) {
				if(content.status != 2) {
					poster_message = content.title;
					return false;
				}
			});
		}
		
		if(lesson.status == 2) {
			//Completed show progress
			lesson.complete = true;
		} else if(lesson.status == 1 || lesson.status == 0) {
			//In progress
			lesson.complete = false;
			if(lesson.status == 0) {
				//Show start with first topic
				lesson.poster_title = 'Start now with';
				lesson.incomplete_message = 'You have not started this lesson';
			} else {
				//Show continue with topic...whatever it is
				lesson.poster_title = 'Continue with';
				lesson.incomplete_message = 'You have not completed this lesson';
			}
			lesson.poster_message = poster_message;
		}
		
		// Collecting all recommendations...
		CoursePlayer.collectRecommendations(lesson, coaching_content, tutoring_content, supp_content, practice_content);
		if(lesson.contents) {
			$.each(lesson.contents, function(idx, content) {
				if(content.status == 2) {
					content.complete = true;
				} else {
					content.complete = false;
				}
				CoursePlayer.collectRecommendations(content, coaching_content, tutoring_content, supp_content, practice_content);
			});
		}
		
		CoursePlayer.setProficiency(lesson);
		CoursePlayer.checkRecommendations(lesson);
		CoursePlayer.populateRecommendations(lesson, 'coaching_content', coaching_content);
		CoursePlayer.populateRecommendations(lesson, 'tutoring_content', tutoring_content);
		CoursePlayer.populateRecommendations(lesson, 'supp_content', supp_content);
		CoursePlayer.populateRecommendations(lesson, 'practice_items', practice_content);
		
		$('#displayPanelGroup').html($(Mustache.render(MustacheTemplate.getTemplate('lesson_summary'), lesson)));
		CoursePlayer.resize();
	},
	showContentSummary: function(contentId) {
		var data = CoursePlayer.dataJson;
		var content = {};
		
		$.each(data.units, function(idx, unit) {
			$.each(unit.lessons, function(idx, lesson) {
				$.each(lesson.contents, function(idx, cont) {
					if(cont.id == contentId) {
						content = cont;
					}
				});
			});
		});

		CoursePlayer.setIconType(content);
		CoursePlayer.setProficiency(content);
		if(content.recommendations) {
			content.hasRecommendation = true;
			if(content.recommendations['coaching_content'] && content.recommendations['coaching_content'].length > 0) {
				content.recommendations['has_coaching_content'] = true;
			}
			if(content.recommendations['tutoring_content'] && content.recommendations['tutoring_content'].length > 0) {
				content.recommendations['has_tutoring_content'] = true;
			}
			if(content.recommendations['supp_content'] && content.recommendations['supp_content'].length > 0) {
				content.recommendations['has_supp_content'] = true;
			}
			if(content.recommendations['practice_items'] && content.recommendations['practice_items'].length > 0) {
				content.recommendations['has_practice_items'] = true;
			}
		}
		$('#displayPanelGroup').html($(Mustache.render(MustacheTemplate.getTemplate('content_summary'), content)));
		CoursePlayer.resize();
	},
	checkRecommendations: function(json) {
		json.recommendations = {};
		json.hasRecommendations = false;
	},
	populateRecommendations: function(json, type, content) {
		if(Object.keys(content).length > 0) {
			if(!json.recommendations) {
				json.recommendations = {};
			}
			json.hasRecommendation = true;
			if(!json.recommendations[type]) {
				json.recommendations[type] = new Array();
				json.recommendations['has_'+ type] = true;
			}
			$.each(content, function(idx, cc) {
				json.recommendations[type].push(cc);
			});
			json.hasRecommendations = true;
		}
	},
	collectRecommendations: function(json, coaching_content, tutoring_content, supp_content, practice_content) {
		if(json.recommendations) {
			var reco = json.recommendations;
			if(reco.coaching_content && reco.coaching_content.length > 0) {
				$.each(reco.coaching_content, function(idx, item) {
					CoursePlayer.setIconType(item);
					coaching_content[item.id] = item;
				});
			}
			if(reco.tutoring_content && reco.tutoring_content.length > 0) {
				$.each(reco.tutoring_content, function(idx, item) {
					CoursePlayer.setIconType(item);
					tutoring_content[item.id] = item;
				});
			}
			if(reco.supp_content && reco.supp_content.length > 0) {
				$.each(reco.supp_content, function(idx, item) {
					CoursePlayer.setIconType(item);
					supp_content[item.id] = item;
				});
			}
			if(reco.practice_items && reco.practice_items.length > 0) {
				$.each(reco.practice_items, function(idx, item) {
					CoursePlayer.setIconType(item);
					practice_content[item.id] = item;
				});
			}
		}
	},
	resize: function() {
		$('.equalheight').css({"height":"auto"});
		$('.equalheight').equalHeights();
	},
	setIconType: function(json) {
		var icon_type = '';
		if(json.media_type == 'video') {
			icon_type = 'icon-facetime-video';
		} else if(json.media_type == 'text') {
			icon_type = 'icon-file-text';
		} else if(json.media_type == 'audio') {
			icon_type = 'icon-volume-up';
		} else if(json.media_type == 'quiz') {
			icon_type = 'icon-question-sign';
		} else if(json.media_type == 'assessment') {
			icon_type = 'icon-star';
		} 
		json.icon_type = icon_type;
	},
	setProficiency: function(json) {
		var prof_icon = 'prof_poor', prof_text = 'Poor';
		if(json.proficiency == 2) {
			prof_icon = 'prof_expert';
			prof_text = 'Expert';
		} else if(json.proficiency == 1) {
			prof_icon = 'prof_medium';
			prof_text = 'Medium';
		} 
		json.prof_icon = prof_icon;
		json.prof_text = prof_text;
	}
}