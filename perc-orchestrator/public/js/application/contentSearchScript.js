$(document).ready(function() {
    $('.cscontextselect').click(function(evt){
        evt.stopPropagation();
        $(".cs-context-container").toggleClass("cs-context-container-hover");
        $('.cscontextselect').val('');
    });
    $(document).click(function() {
        $('.cs-context-container').removeClass('cs-context-container-hover'); //make all inactive
    });
});

