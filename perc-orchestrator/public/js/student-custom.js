$(function () {

	var wheight = $(window).outerHeight();
	var drawyermenuHeight = $('.drawyer-menu').outerHeight();
	
	$('.course_summary, .course_details,.lesson_details').height(drawyermenuHeight);
	
	$(window).resize(function(){
			var wheight = $(window).innerHeight();
			var drawyermenuHeight = $('.drawyer-menu').outerHeight();
			$('.course_summary,.course_details,.lesson_details').height(drawyermenuHeight);
	});

	$('a.slide_in').on('click',function(){
		$(this).toggleClass('active')
		if(!$('body').hasClass('visibile-drawer-menu')){
				$('body').toggleClass('visibile-drawer-menu').removeClass('visibile-drawer-hidden-menu');	
		}
		else if($('body').hasClass('visibile-drawer-menu')) {
			$('body').toggleClass('visibile-drawer-hidden-menu').removeClass('visibile-drawer-menu');
		}
	 	$('.drawyer-menu').show();
	})
});

