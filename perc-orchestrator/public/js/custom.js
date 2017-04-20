// JavaScript Document
(function() {
    $('.tool').tooltip();
    $('.tool-tip').tooltip();
    
    $(".panel-title .collapse-icon").click(function() {
        $(this).parents(".panel-group").find(".collapse-icon").removeClass('active');
        $(this).addClass("active");
    });

    /* */
    $(".arrowIcn-left").hover(function() {
        $(this).find(".previous-title").show();
    }, function() {
        $(this).find(".previous-title").hide();
    });

    $(".arrowIcn-right").hover(function() {
        $(this).find(".next-title").show();
    }, function() {
        $(this).find(".next-title").hide();
    });

    $(".video-container").hover(function() {
        $(this).find(".arrowIcn-left,.arrowIcn-right").show();
    }, function() {
        $(this).find(".arrowIcn-left,.arrowIcn-right").hide();
    });

    $(".number.votes").hover(function() {
        $(this).find(".thumbsUpIcn .fa-thumbs-up").show();
    }, function() {
        $(this).find(".thumbsUpIcn .fa-thumbs-up").hide();
    });

    $(".number.fav").hover(function() {
        $(this).find(".favIcn .fa-heart").show();
    }, function() {
        $(this).find(".favIcn .fa-heart").hide();
    });

    $(function() {
        $('[data-toggle="tooltip"]').tooltip();
    });

    $('#writeIcon').click(function() {
        $('#editHidden').addClass('animated fadeInDown').slideToggle();
        $('#questionContainer').css("padding-top", "50px");
    });

    $('#removeIcn').click(function() {
        $('#editHidden').addClass('animated fadeInUp').slideToggle();
        $('#questionContainer').css("padding-top", "0px");
    });



    /*$('.NavLeftContainer .common_box').each(function() {
        var that = $(this)
        $(this).on('click', function() {
            var clickMe = $(this);
            var totalHeight = 0;
            var myHeight = $(this).outerHeight();
            //console.log(myHeight + 'height of the current box');
            var allBox = $(this).prevAll('.common_box');

            allBox.each(function() {
                var indvHeight = $(this).outerHeight();
                totalHeight += indvHeight;
                var finalHeight = totalHeight + 2;
                //console.log(finalHeight + 'height to be added');
                clickMe.find('.dropdown-menu').css({
                    //top: -finalHeight + 'px'
                })

            });

        });
    });*/

    $('.NavLeftContainer ul li').click(function(e) {
        e.stopPropagation();
        //$(".mid-area,.RightSideBar").addClass("leftOpen");
        $('.NavLeftContainer ul li').removeClass('open');
        $(this).addClass('open');
    });

    $("body").click(function(e) {
        $(".mid-area,.RightSideBar").removeClass("leftOpen");
    });

    $('.sideicon3').on('click', function() {
        $(".RightSideBar").toggleClass('Effectsidebar');
        $(".mid-area").toggleClass('Effectside');
        $(".right-search-btn").toggle('slow');
        setTimeout(function() {
            resizeDashboardGrid();
            resizeStudentSummaryGrid();
            resizeStudentGradebookGrid();
            CurrentPlayer.resizeMediaPlayer();
            IntroVideoPlayer.resize();
        }, 500);
        if ($('.RightSideBar').hasClass('Effectsidebar')) {
            $('.arrowIcn-right').css("right", "25px");
        } else {
            $('.arrowIcn-right').css("right", "250px");
        }
    });

    /* added by raj */
    //$("#custom-search-input").hide();

    $('#HeadSearch').on('click', function() {
        $("#custom-search-input").toggleClass('open_search');
        $("body").toggleClass('open');
        $("#RemoveSearch").toggle('');


    });

    $('#RemoveSearch').on('click', function() {
        $("#custom-search-input").removeClass('open_search');
        $("body").removeClass('open');
        $("#RemoveSearch").toggle('');
    });

    $('#cusSearchin').on('click', function() {
        $(".searchDrapdown").addClass("bg_drop");
        $(".dropSearchHide").show("slow");
        $("input.form-control").addClass("searchdrpinput", 1000);
        $("#cusSearchBtn").toggleClass("searchdrpinput", 1000);
    });

    $('.searchDrapdown .input-group-btn').on('click', function() {

        $("input.form-control").toggleClass("searchdrpinput");
        $("#cusSearchBtn").toggleClass("searchdrpinput");
    });

    $('.bottomendbtn').on('click', function() {
        $("input.form-control").toggleClass("searchdrpinput", 1000);
        $("#cusSearchBtn").toggleClass("searchdrpinput", 1000);
        $(".dropSearchHide").slideUp("slow", function() {
            $(".searchDrapdown").toggleClass("bg_drop");
        });
    });

    $('.customClose').on('click', function() {
        $(".dropSearchHide").toggle();
        $(".searchDrapdown").toggleClass("bg_drop");

    });

    $('.writeBlackOne').on('click', function() {
        $(".AskQEdit").slideToggle('slow');
        $(this).toggleClass('fa-close');
        $(this).toggleClass('fa-edit');
    });


    $('.CourselistHead a').on('click', function() {
        $(this).toggleClass("lesson-active");
        $(this).parents(".CourselistHead").toggleClass('noborder');
    });



    $('.groupName, .addGrp').on('click', function() {
        $(".firstpage").hide();
        $(".secondpage").show();
    });
    $('.groupFloder').on('click', function() {
        $(".firstpage").hide();
        $(".thirdpage").show();
    });


    $('.addmemberhead').on('click', function() {
        $(".thirdpage").show();
        $(".secondpage").hide();
    });
    $('.groupright.fa.fa-close').on('click', function() {
        $(".thirdpage").hide();
        $(".firstpage").show();
    });



    $('a.canadd.fa.fa-plus').on('click', function() {

        $(this).toggleClass("fa-plus");
        $(this).toggleClass("fa-check");


    });
    $('a.canadd.fa.fa-check').on('click', function() {

        $(this).toggleClass("fa-check");
        $(this).toggleClass("fa-plus");



    });


    $(".delgrp").hover(function() {
        $(this).find(".canuseadd.fa.fa-close, .canuseadd.fa.fa-minus").toggle();
        $(this).find("span.usergroupdetails").toggleClass("groupBlue");
    });




    $(".groupuser.activated").hover(function() {
        $(this).find("a.canclose").toggle();

    });
    $(".groupAddround").hover(function() {

        $(this).next(".groupName").toggleClass("groupBlue");

    });

    $(document).ready(function() {
        $('#popoverData').popover({
            html: true,
            content: function() {
                return $('#popover_content_wrapper').html();
            }
        });

        $('#popoverData1').popover({
            html: true,
            content: function() {
                return $('#popover_content_wrapper1').html();
            }

        });

        $('#popoverData2').popover({
            html: true,
            content: function() {
                return $('#popover_content_wrapper2').html();
            }

        });

    });
    /*$('#cusSearchBtn').click(function(){
            $('.searchDrapdown.bg_drop').show();
        });*/



    $('.plus').on('click', function() {
        $(this).find('i').toggleClass('icon_cross');
        $('.main_btn_text').toggle();
        $('.ul_list').toggleClass('new')
        $('.box').toggleClass('new_box')
        $('.white_overlay').toggle();
    });
    $('.white_overlay').on('click', function() {
        //$(this).find('i').toggleClass('icon_cross');
        //$('.main_btn_text').toggle();
        //$('.ul_list').toggleClass('new')
        //$('.box').toggleClass('new_box')
        $(this).hide();
        $(".menu_button").removeClass("btn-rotate");
        $("#outer_container").removeClass('active');
        $(".menu_option li").css({
            left: "0px",
            top: "0px"
        });
    });
    $(".tooltip-class").tooltip();




    /*menu */
    if ($('#outer_container').length != 0) {
        $('#outer_container').PieMenu({
            'starting_angel': 100,
            'angel_difference': 80,
            'radius': 150,
        });
    }

    $(window).resize(function() {
        windowHeight();
        var windowH = $(window).outerHeight();
        var headerH = $("header").outerHeight();
        $(".hordropdowncontainer").height(windowH - headerH - 150);
    });

    function windowHeight() {
        var windowH = $(window).outerHeight();
        var headerH = $("header").outerHeight();
        var footerH = $(".footerClass").outerHeight();
        //$(".RightSideBar").height(windowH - headerH);
        //$(".mid-area").height(windowH - headerH);
        //$(".customHeight").height(windowH - headerH);
        //$(".NavLeftContainer:first-child ul").height(windowH - headerH);
        $(".mid-container-full").height(windowH - headerH);
        $(".mid-container").height(windowH - headerH - footerH);
        //$(".video-container iframe,.video-container").height(windowH - 350 );

    }

    $(".NavLeftContainer ul li").on('click', function(event) {
        $(".NavContentz").removeClass("leftbarshadow");
    });
    $(".NavLeftContainer ul.dropdown-menu").click(function(event) {
        event.stopPropagation()
    });

    setTimeout(function() {
        windowHeight();
    }, 500);

})();

function updateVideoPostWH() {
    var w = $('.embed-responsive-16by9 > .embed-responsive-item').width();
    if(w) {
        $('.embed-responsive-16by9 > .embed-responsive-item').height(w*9/16);
    }
    w = $('.embed-responsive-4by3 > .embed-responsive-item').width();
    if(w) {
        $('.embed-responsive-4by3 > .embed-responsive-item').height(w*3/4);
    }
}

function rightBarSearchDivOpen() {
    var windowH = $(window).outerHeight();
    var headerH = $("header").outerHeight();
    var rsearchct = $(".right-search-container").outerHeight();
    var sheight = windowH - headerH - rsearchct;
    $(".right-search-container").height(windowH - headerH);
    $(".advsearcct").height(sheight);
    $(".hordropdowncontainer").css('height', sheight - 50);
    $(".RightsideContainer").hide();
    $(".right-search-btn").addClass('btnFix');
    $('#outer_container').hide();
}

function rightBarSearchDivClose() {
    var windowH = $(window).outerHeight();
    var headerH = $("header").outerHeight();
    $(".advsearcct").height(0);
    var rsearchct = $(".right-search-container").outerHeight();
    $(".right-search-container").height("auto");
    $(".RightsideContainer").show();
    $(".right-search-btn").removeClass('btnFix');
    $('#outer_container').show();
}

$(document).ready(function(){
    if (!($('#userDropDown').attr('aria-haspopup') == undefined &&
    $('#userDropDown').attr('aria-expanded') == undefined)) 
        //$('.dropdown-toggle').click(function (e) { return false; });
        $('#userDropDown').click(function (e) { return false; });

    //highlighting the selected left menu
    $("#mainNavMenu [role='presentation']").click(function(){
        $("#mainNavMenu [role='presentation'] a").removeClass("active");
        $(this).find('a').addClass("active");
    });
});