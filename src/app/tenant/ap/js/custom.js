sessionStorage.setItem("tenantSlug", "apekx");

$(document).ready(function(){
	sessionStorage.setItem("rootTenantLogo", "ap");
	// Add smooth scrolling to all links
	$(".navbar .nav-item a.nav-link").on('click', function(event) {
		if (this.hash !== "") {
			event.preventDefault();
			var hash = this.hash;

			$('html, body').animate({
				scrollTop: $(hash).offset().top
			}, 800, function(){
				window.location.hash = hash;
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
		sessionStorage.setItem("rootTenantLogo", "ap");
		window.location.href = window.location.origin + "/home";
	})

});

