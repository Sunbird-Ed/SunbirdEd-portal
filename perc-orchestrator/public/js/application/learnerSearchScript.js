$(document).ready(function() {
    $('.lscontextselect').click(function(evt){
        evt.stopPropagation();
        $(".ls-context-container").toggleClass("ls-context-container-hover");
        $('.lscontextselect').val('');
    });
    $(document).click(function() {
        $('.ls-context-container').removeClass('ls-context-container-hover'); //make all inactive
    });
});
