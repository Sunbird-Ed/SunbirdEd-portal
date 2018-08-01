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
		
	
$('.slideshow-carousel').owlCarousel({
	loop:true,
	nav:true,
	navText:['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
	dots:true,
	items:1,
	autoplay:true,
	autoplayTimeout:5000,
	autoplayHoverPause:true
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
$('.vision-carousel').owlCarousel({
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
	autoplayTimeout:1000,
	autoplayHoverPause:true
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



$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});

function changeVideo(videoid) {
	$("#videoPlayer iframe").remove();
	$('<iframe frameborder="0" allowfullscreen></iframe>')
		.attr("src", "https://www.youtube.com/embed/" + videoid + "?rel=0&amp;showinfo=0")
		.appendTo("#videoPlayer");
	}
	$('.playlist-cover').delegate('.playlist-list-item', 'click', function() {
		$(this).addClass('active').siblings().removeClass('active');
});
