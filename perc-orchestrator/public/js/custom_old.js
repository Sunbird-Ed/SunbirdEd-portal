function leftrightEqualHeight() {
    var windowHeight = $(window).height();
    var hheight = $('header').outerHeight();
    var perheight = $('.perceptron-links-section').outerHeight();
    var footerheight = 0;

    if ($('.footer').length > 0 && $('.footer').is(':visible')) {
        footerheight = $('.footer').outerHeight();
    }
    var TopFooterHeight = hheight + perheight + footerheight; //+10
    $('.left-nav-ct,.actions').height(windowHeight - TopFooterHeight);
}

function MiddleCtH() {
    var windowHeight = $(window).height();
    var hheight = $('header').outerHeight();
    var perheight = $('.perceptron-links-section').outerHeight();
    var footerheight = 0;
    if ($('.footer').length > 0 && $('.footer').is(':visible')) {
        footerheight = $('.footer').outerHeight();
    }
    var MiddleCtHeight = hheight + perheight + footerheight + 30;
    $('.main_container .main').height(windowHeight - MiddleCtHeight);
}

function MainMidCtheight() {
    var MainMidheight = $('.main_container .main').outerHeight();
    var MainMidWidth = $('.main_container .main').outerWidth();
    $('.action-icon-div-ct .content').height(MainMidheight).animate({
        width: MainMidWidth
    }, 100);
}

function initializeTree() {

    $('.tree li:has(ul)').find('span.title-txt').click(function() {
        $('.tree li:has(ul)').find('span.title-txt').removeClass('list-active');
        $('.tree li').find('.move-tree-item').hide();
        $('.tree li:has(ul)').find('.tree-more-dropdown').hide();
        $(this).addClass('list-active');
        $(this).parents('li').find('.move-tree-item').show();
        $(this).parent().next('.tree-more-dropdown').show();
    });
}

function collapseTree(thisObj) {
    var children = $('#' + thisObj).parent().parent('li.parent_li').find(' > ul > li');
    if (children.is(":visible")) {
        children.hide('fast');
        $('#' + thisObj).addClass('icon-plus').removeClass('icon-minus');
    } else {
        children.show('fast');
        $('#' + thisObj).addClass('icon-minus').removeClass('icon-plus');
    }
}

var currMenu = "";

function showActionSlider(target) {
    $('.action-icon-div-ct').show();
    $("ul.selectable li").removeClass("active");
    $('#' + target).addClass("active");
    $('.action-icon-div-ct .content').height('0').width(0);
    MainMidCtheight();
}

function hideActionSlider() {
    $('.action-icon-div-ct .content').animate({
        width: 150
    }, 200, function() {
        $("ul.selectable li").removeClass('active');
    });
    $('.action-icon-div-ct').delay(200).hide(0);
}

function selectableSlider() {
    $("ul.selectable li").click(function(e) {
        e.preventDefault();
        if (e.currentTarget == currMenu) {
            return;
        } else {
            currMenu = e.currentTarget;
        }

        //Insert Content here
        $('.action-icon-div-ct .common_heading').text($(this).find('span').text());

        //Insert Content above
        $('.action-icon-div-ct').show();
        $("ul.selectable li").removeClass("active");
        $(this).addClass("active");
        $('.action-icon-div-ct .content').height('0').width(0);
        MainMidCtheight();
    });
    $('.pop-close-btn').click(function() {
        currMenu = "";
        $('.action-icon-div-ct .content').animate({
            width: 150
        }, 200, function() {
            $("ul.selectable li").removeClass('active');
        });
        $('.action-icon-div-ct').delay(200).hide(0);

    });
}

function initializeLayout() {

    /* tree nav and selection  */
    initializeTree();
    /* tree nav and selection end */

    leftrightEqualHeight();
    MiddleCtH();
    var currMenu = "";
    selectableSlider();
    /* window resize */

    $(window).resize(function() {
        leftrightEqualHeight();
        MiddleCtH();
        MainMidCtheight();
        var windowHeight = $(window).height();
        $('#import_modal .modal-dialog').outerHeight(windowHeight - 50);
    });


    $("#import_modal .modal-body").load("import.html", function() {
        //alert( "Load was performed." );
    });

    $('a.ext-url').on('click', function(e) {
        leftrightEqualHeight();
        MiddleCtH();
        var windowHeight = $(window).height();
        $('#import_modal .modal-dialog').outerHeight(windowHeight - 50)
        /* e.preventDefault();
	   var url = $(this).attr('href');
	   var wheight = $(window).height()
	    $(".modal-body").html('<iframe width="100%" height="'+wheight+'" frameborder="0" scrolling="no" allowtransparency="true" src="'+url+'"></iframe>');*/
    });

    $('.search_icon').click(function() {
        $('.search_box').slideToggle();
    });

    $('.seq a').click(function() {
        $('.player-container-').show();
        $('.add_content').hide();
    });

    $('.add_content').click(function() {
        $('#collapseTwo').removeClass('in');
        $('#collapseOne').addClass('in');
    });
    $('.add_item').on('click', function() {
        $('.sequences').show();
        $('#collapseTwo').addClass('in');
        $('#collapseOne').removeClass('in');
        $('.added_contents').show();
    });
    $('.reset_item').click(function() {
        $('.sequences').hide();
        $('.added_contents').hide();
    });
    $('.seq_item').click(function() {
        $('.add_content').hide();
        $('.media_content').show();
    });
}

$(function() {
    initializeLayout();
});

function parseScribdURL(url) {
    var result = URI.parse(url);
    var object = {};
    object.id = result.path.replace('/embeds/','').replace('/content', '');
    var query = URI.parseQuery(result.query);
    object.access_key = query.access_key;
    return object;
}
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
};

// 
// // JavaScript Document
// $(function(){
// 	$('.tool').tooltip();	
// 	$('.tool-tip').tooltip();
// 	
// 	$(".panel-title .collapse-icon").click(function() {
// 		$(this).parents(".panel-group").find(".collapse-icon").removeClass('active');
//      $(this).addClass("active");  
// 	// $(this).parents(".panel-group").find(".collapse-icon").removeClass("active"); 
//     });	
// 	
// 	$('.il-sideTagMedium').hover(function(){
// 			$(this).find('span').show();
// 		},function(){
// 			$(this).find('span').hide();
// 			});
// 	
// 	
// })();