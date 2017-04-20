jQuery.cachedScript = function( url, options ) {
 
  // Allow user to set any option except for dataType, cache, and url
  options = $.extend( options || {}, {
    dataType: "script",
    cache: true,
    url: url
  });
 
  // Use $.ajax() since it is more flexible than $.getScript
  // Return the jqXHR object so we can chain callbacks
  return jQuery.ajax( options );
};

$(document).ready(function() {
	$('i').tooltip();		
	enableSmoothScroll();
});

function enableSmoothScroll() {
//Performs a smooth page scroll to an anchor on the same page.
	$('a[href*=#]:not([href=#])').on('click', function() {
		
		$(this).parent().parent().parent().removeClass('open');
		if(location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') 
			|| location.hostname == this.hostname) {

			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html,body').animate({scrollTop: target.offset().top-30}, 1000);
				return false;
			}
		}
	});
}

(function($) {

    $.fn.equalHeights = function() {
        var maxHeight = 0,
            $this = $(this);

        $this.each( function() {
            var height = $(this).innerHeight();

            if ( height > maxHeight ) { maxHeight = height; }
        });

        return $this.css('height', maxHeight);
    };

    // auto-initialize plugin
    $('[data-equal]').each(function(){
        var $this = $(this),
            target = $this.data('equal');
        $this.find(target).equalHeights();
    });

})(jQuery);

(function($) {
    $.fn.ellipsis = function()
    {
            return this.each(function()
            {
                    var el = $(this);

                    if(el.css("overflow") == "hidden")
                    {
                            var text = el.html();
                            var multiline = el.hasClass('multiline');
                            var t = $(this.cloneNode(true))
                                    .hide()
                                    .css('position', 'absolute')
                                    .css('overflow', 'visible')
                                    .width(multiline ? el.width() : 'auto')
                                    .height(multiline ? 'auto' : el.height())
                                    ;

                            el.after(t);

                            function height() { return t.height() > el.height(); };
                            function width() { return t.width() > el.width(); };

                            var func = multiline ? height : width;

                            while (text.length > 0 && func())
                            {
                                    text = text.substr(0, text.length - 1);
                                    t.html(text + "...");
                            }

                            el.html(t.html());
                            t.remove();
                    }
            });
    };
})(jQuery);

Common = {
	menu: null,
	menuOpen: false,
	sideToggle: function(toggle) {
		if($('#icon_chevron').hasClass('icon-chevron-left')) {
			$('#icon_chevron').removeClass('icon-chevron-left').addClass('icon-chevron-right');
			$('#stm_icon_btn').off();
			$('#stm_icon_btn').on('click', function() {
				Common.sideToggle();
			});
		} else {
			$('#icon_chevron').removeClass('icon-chevron-right').addClass('icon-chevron-left');
			$('#stm_icon_btn').off();
			$('#stm_icon_btn').on('click', function() {
				Common.clearTopicId();
				QP.showQuestions();
			});
		}
		Common.menu.toggle();
		Common.resizePlayer();
		Common.menuOpen = !Common.menuOpen;
	},
	resizePlayer: function() {
		if($('#playerMainContainer').length > 0) {
			if($('#playerMainContainer').hasClass('col-md-12')) {
				$('#playerMainContainer').removeClass('col-md-12').addClass('col-md-7');
			} else if($('#playerMainContainer').hasClass('col-md-7')) {
				$('#playerMainContainer').removeClass('col-md-7').addClass('col-md-12');
			}
		}
	},
	initSideToggleMenu: function() {
		Common.menu = new sidetogglemenu({
			id: 'sideToggleMenu',
			position: 'right',
			pushcontent: false,
			dismissonclick: false,
			revealamt: 0
		});
		$('#stm_icon_btn').on('click', function() {
			Common.clearTopicId();
			QP.showQuestions();
		});
		$('span[class=icon-stack]').tooltip({placement: 'bottom'});
	},
	setTopicId: function(topicId) {
		$('#stm_form :input[name=topic_id]').val('{{id}}');
	},
	clearTopicId: function(topicId) {
		$('#stm_form :input[name=topic_id]').val('');
	},
	backToMain: function() {
		$('#stm_details').hide();
		$('#stm_body').show();
	},
	setIconType: function(json) {
		var icon_type = '';
		if(json.media_type == 'video') {
			icon_type = 'icon-facetime-video';
		} else if(json.media_type == 'text' || json.media_type == 'pdf') {
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
	setIconContType: function(json) {
		var icon_cont_type = '';
		if(json.content_type == 'Tutor') {
			icon_cont_type = 'T';
		} else if(json.content_type == 'Supplementary') {
			icon_cont_type = 'S';
		}  
		json.icon_cont_type = icon_cont_type;
	}
}