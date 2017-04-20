function affixLeftMenu() {
	adjustTOCWidth();
	adjustTOCHeight();
    $('.tocCarousel').jcarousel();
}

function adjustTOCWidth() {
	$('.tocFloatMenu').width($('.tocColumn').width());
	var ww = $(window).width();
	$('.tocCarousel li').width(22/100 * ww);
}
var minusTocHeight;
var minusDiscoverHeight;
var minusQAMenuHeight;
var minusLSMenuHeight;

function adjustTOCHeight() {
	var h = $(window).height();
	var h1 = $('header').height();
	var h2 = $('#tocParentDiv').height();
	var h3 = $('#paginationBtns').height();
	var h4 = $('#leftBarHeader').height();
	minusTocHeight = h1+h2+h3+h4+55;
	$('.tocCarousel').css({'overflow-y':'scroll', 'overflow-x':'hidden', height: (h-minusTocHeight)});
}

function adjustDiscoverTOCHeight() {
	$('.tocFloatMenu').width($('.tocColumn').width());
	var h = $( window ).height();
	var w = $( window ).width();
	var h1 = $('header').height();
	var dh3 = $('#discoverPaginationBtns').height();
	var h4 = $('#discLeftBarHeader').height();
	minusDiscoverHeight=h1+dh3+h4+30;
	$('.discoverCarousel li').width(22/100 * w);
	$('.discoverCarousel').css({'overflow-y':'scroll', 'overflow-x':'hidden', height: (h-minusDiscoverHeight)});
}

function adjustQAMenuHeight() {
	var h = $(window).height();
	var w = $(window).width();
	var h1 = $('header').height();
	var h2 = $('.bottom-search').height();
	var h3 = $('#qaLeftBarHeader').height();
	minusQAMenuHeight=h1+h2+h3;
	$('.qa-filters').css({height: (h-minusQAMenuHeight)});
}

function adjustLSMenuHeight() {
	var h = $(window).height();
	var w = $(window).width();
	var h1 = $('header').height();
	var h2 = $('.bottom-search').height();
	var h3 = $('#lsLeftBarHeader').height();
	minusLSMenuHeight=h1+h2+h3;
	$('.ls-filters').css({height: (h-minusLSMenuHeight)});
}

function resizeLeftNav() {
	var w = $(window).width();
	var h = $( window ).height();
	$('.tocCarousel li').width(22/100 * w);
	$('.discoverCarousel li').width(22/100 * w);
	$('.tocCarousel').animate({height: (h-minusTocHeight)}, 400, 'swing');
	$('.discoverCarousel').animate({height: (h-minusDiscoverHeight)});
	$('.qa-filters').animate({height: (h-minusQAMenuHeight)});
	$('.ls-filters').animate({height: (h-minusLSMenuHeight)});
}

$(window).resize(function() {
	resizeLeftNav();
});

function select(athis) {
	$('.unit').removeClass('unitActive');
	$(athis).parent().addClass('unitActive');
}

$('.progress').tooltip({html: true});

function showCourseIntroVideo() {
	$('#course_intro_more_link').hide();
	$('#course_intro_video_div').show();
}

function hideCourseIntroVideo() {
	var videoId = 'course_intro_video';
	var introPlayer = videojs(videoId);
	introPlayer.pause();
	$('#course_intro_more_link').show();
	$('#course_intro_video_div').hide();
}
$(".tocFloatMenu").hover(function() {
	var val = $('body').css("overflow");
	if(val == "visible") {
		$('body').css("overflow","hidden");
	} else {
		$('body').css("overflow","visible");
	}
});
contextSearchPrevValue = '';
$(document).ready(function() {
	$('.qacontextselect').click(function(evt) {
    	evt.stopPropagation();
        $(".qa-context-container").toggleClass("qa-context-container-hover");
        $('.qacontextselect').val('');
    });
    $(document).click(function() {
        $('.qa-context-container').removeClass('qa-context-container-hover'); //make all inactive
        if($('.qacontextselect').val() == '') {
        	$('.qacontextselect').val(contextSearchPrevValue);
        }
    });
});


var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=:";
function decode64(input) {
   if (!input) return false;
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;

   // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

   do {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
         output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
         output = output + String.fromCharCode(chr3);
      }
   } while (i < input.length);

   return output;
}