function initializeTree() {

    $('.tree li:has(ul)').find('span.title-txt').click(function(){
    		$('.tree li:has(ul)').find('span.title-txt').removeClass('list-active');
    		$('.tree li').find('.move-tree-item').hide();
    		$('.tree li:has(ul)').find('.tree-more-dropdown').hide();
    		$(this).addClass('list-active');
    		$(this).parents('li').find('.move-tree-item').show();
    		$(this).parent().next('.tree-more-dropdown').show();
    });
}

function collapseTree(thisObj) {
	var children = $('#'+ thisObj).parent().parent('li.parent_li').find(' > ul > li');
    if (children.is(":visible")) {
        children.hide('fast');
        $('#'+ thisObj).addClass('icon-plus').removeClass('icon-minus');
    } else {
        children.show('fast');
        $('#'+ thisObj).addClass('icon-minus').removeClass('icon-plus');
    }
}

function navigateTo(path, param) {
	 document.location.href = path + encodeURIComponent(param);
}

function MiddleCtH() {
	var windowHeight = $(window).height();
	var MiddleCtHeight = $('header').height() + $('.perceptron-links-section').height() + $('.percept_footer').height()+60;
	$('.main_container .main').height(windowHeight - MiddleCtHeight);
}

function leftrightEqualHeight() {
	var windowHeight = $(window).height();
	var TopFooterHeight = $('header').height() + $('.perceptron-links-section').height() + $('.percept_footer').height() + 11;
	$('.left-nav-ct,.actions').height(windowHeight - TopFooterHeight );
}

function autoAdjustSequencePanel() {
	var seqPanelWidth = $('.sequence-panel').width();
	var width = 0;
	$('ul.sequences > li').each(function() {
	    width += $(this).width() + 20;
	});
	$('ul.sequences').css({width: Math.max(width, seqPanelWidth)});
}

$(function () {


	/* tree nav and selection  */
	//initializeTree();
	/* tree nav and selection end */

	$('.hideRightPanel').click(function(){
		$('.actions').hide();
		$('.main_container').removeClass('col-md-6').addClass('col-md-9');
		$('.showRightPanel').show();
	});

	$('.showRightPanel').click(function(){
		$('.actions').show();
		$('.main_container').removeClass('col-md-9').addClass('col-md-6');
		$(this).hide();
	});

	/* equal height for left, right, middle */
	leftrightEqualHeight();
	MiddleCtH();


	/* window resize */
	$(window).resize(function(){
		leftrightEqualHeight();
		MiddleCtH();
	});
});

Custom = {
	menu: null,
	initSideMenu: function() {
		Custom.menu = new sidetogglemenu({
		    id: 'actionsSideToggle',
		    position: 'right',
		    pushcontent: false,
		    dismissonclick: true,
		    revealamt: 0
		});
	},
	toggleMenu: function() {
		Custom.menu.toggle();
	}
}

function secondsTimeSpanToHMS(s) {
    var h = Math.floor(s/3600); //Get whole hours
    s -= h*3600;
    var m = Math.floor(s/60); //Get remaining minutes
    s -= m*60;
    return h+":"+(m < 10 ? '0'+m : m)+":"+(s < 10 ? '0'+s : s); //zero padding on minutes and seconds
}