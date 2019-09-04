sessionStorage.setItem("tenantSlug", "up");

$(document).ready(function(){
	sessionStorage.setItem("rootTenantLogo", "up");
	// Add smooth scrolling to all links
	$(".navbar .nav-item a.nav-link").on('click', function(event) {
		event.preventDefault();
		if (this.hash !== "") {
			event.preventDefault();
			var hash = this.hash;
			$('html, body').animate({
				scrollTop: $(hash).offset().top - $("#menu").height()
			}, 800, function(){
			});
		}
	});


	// Add scroll to top
	$("#scrollTop").on('click', function(event) {
			event.preventDefault();

			$('html, body').animate({
				scrollTop: 0
			}, 800);
	});

	jQuery(window).scroll(function() {
		if (jQuery(this).scrollTop() > 250) {
			jQuery('#scrollTop').fadeIn(300);
		} else {
			jQuery('#scrollTop').fadeOut(300);
		}
	});

	$("#loginBtn").on("click",function(){
		sessionStorage.setItem("rootTenantLogo", "up");
		window.location.href = window.location.origin + "/home";
	})

});

