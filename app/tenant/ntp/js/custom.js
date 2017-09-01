window.sr = ScrollReveal();
sr.reveal('.foo');
sr.reveal('.bar');


$(document).ready(function() {
	$('.popup-with-zoom-anim').magnificPopup({
		type: 'inline',
		fixedContentPos: false,
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: false,
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-zoom-in'
	});
	
	$('.popup-with-move-anim').magnificPopup({
		type: 'inline',
		fixedContentPos: false,
		fixedBgPos: true,
		overflowY: 'auto',
		closeBtnInside: true,
		preloader: false,
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-slide-bottom'
	});
});
		
		
		
$('.quote-carousel').owlCarousel({
	loop:true,
	nav:true,
	dots:false,
	items:1,
	navText:['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
	autoplay:true,
	autoplayTimeout:5000,
	autoplayHoverPause:true
});
$('.journey-carousel').owlCarousel({
	loop:true,
	nav:true,
	items:1,
	navText:['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
	autoplay:true,
	autoplayTimeout:5000,
	autoplayHoverPause:true
});
$('.parter-carousel').owlCarousel({
	loop:true,
	nav:false,
	dots:false,
	autoWidth:true,
	autoplay:true,
	autoplayTimeout:2000,
	autoplayHoverPause:true
});

function changeVideo(videoid) {
	$("#videoPlayer iframe").remove();
	$('<iframe frameborder="0" allowfullscreen></iframe>')
		.attr("src", "https://www.youtube.com/embed/" + videoid + "?rel=0")
		.appendTo("#videoPlayer");
	}
	$('.playlist-cover').delegate('.playlist-list-item', 'click', function() {
		$(this).addClass('active').siblings().removeClass('active');
});
	
	
	
$(document).ready(function(){
	$(".readMore").click(function(){
		$(".more-text").slideDown('slow','swing');
		$(".readMore").addClass("hide");
	});
	$(".readLess").click(function(){
		$(".more-text").slideUp('slow','swing');
		$(".readMore").removeClass("hide");
	});
});

var introVideo=document.getElementById("introVideo"); 

function playPause(){ 
	if (introVideo.paused) 
		introVideo.play(); 
	else 
		introVideo.pause(); 
} 


jQuery(window).on('scroll',function(e) {
	var massheadHeight = jQuery('#header').outerHeight();
	var mainNavHeight = jQuery('#nav-bar').outerHeight();
	var scrolledHeight = jQuery(window).scrollTop();

    if( scrolledHeight > massheadHeight){
		jQuery('#nav-bar').addClass('nav-fix');
    } else {
		jQuery('#nav-bar').removeClass('nav-fix');
    }
});
