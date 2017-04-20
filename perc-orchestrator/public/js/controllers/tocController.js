app.controller('tocCtrl',['$scope', '$http', '$timeout', '$rootScope', '$stateParams', '$location', 'CourseBrowserService', '$window', '$state', '$q', function($scope, $http, $timeout, $rootScope, $stateParams, $location, CourseBrowserService, $window, $state, $q) {
	$scope.getTOCByTime = function(){
		$http.get('/private/v1/player/dashboard/tocByTime/'+encodeURIComponent($rootScope.courseId)).success(function(toc){
			//console.log("got TOC BY TIME ",JSON.stringify(toc));
			$scope.tocByTime = toc;
			setTimeout(function() {
                $('[data-toggle="tooltip"]').tooltip();
            }, 500);
            $scope.loadingTOC = false;
		});
	}	
	$scope.loadingTOC = true;
	$scope.getTOCByTime();

	$scope.playLecture = function(elementId) {
		$state.go('cb', {lobId: CourseBrowserService.removeFedoraPrefix(elementId)});
	}

	$scope.expandCurrentElement = function(weekIndex, moduleIndex, lessonIndex){
		setTimeout(function(){
			$('.weekHeader'+weekIndex).css({'color' : '#ff0033'});
			//$('.currentModuleBadge'+weekIndex+'_'+moduleIndex).attr('style', 'background-color: #ff0033 !important');
			//$('.currentLessonBadge'+weekIndex+'_'+moduleIndex+'_'+lessonIndex).attr('style', 'background-color: #ff0033 !important');
			$('#week'+weekIndex).collapse('show');
			$('#collapse'+weekIndex+'_'+moduleIndex).collapse('show');
			$('#course'+weekIndex+'_'+moduleIndex+'_'+lessonIndex).collapse('show');
		},1000);
	}

	$scope.slideToEvents = function(){
		console.log("Slide TO events");
		/* slide is breaking the UI
		$('html, body').animate({
        	scrollTop: $('#eventsContainer').offset().top
    	}, 1000);
		*/
	}

	$rootScope.secondsToStr = function(totalSeconds){
		if(totalSeconds > 0 ){
			var humanReadable = '';
			function numberEnding (number) {
	        	return (number > 1) ? 's ' : ' ';
		    }
		    var temp = Math.floor(totalSeconds);
		    var days = Math.floor((temp %= 31536000) / 86400);
		    if (days) {
		         humanReadable += days + ' day' + numberEnding(days);
		    }
		    var hours = Math.floor((temp %= 86400) / 3600);
		    if (hours) {
		        humanReadable +=  hours + ' hour' + numberEnding(hours);
		    }
		    var minutes = Math.floor((temp %= 3600) / 60);
		    if (minutes) {
		    	if(!((humanReadable.indexOf('day') > -1) && (humanReadable.indexOf('hour') > -1)))
		        	humanReadable +=  minutes + ' minute' + numberEnding(minutes);
		    }
			return humanReadable;
		}else{
			return;
		}
	}

}]);

setTimeout(function(){
	$('[data-toggle="tooltip"]').tooltip();
	$('.CourselistHead a').on('click',function(){
    	$(this).toggleClass("lesson-active");
    	$(this).parents(".CourselistHead").toggleClass('noborder');
	});
}, 4000);
