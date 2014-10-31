var getData = function (div_selector, button_selector) {
       $(div_selector).on('click',button_selector,function () {
               var event_textbox = $("<div />").append($(div_selector).children(':last').clone())
                                                       .html();
               if($(this).find('span').hasClass("glyphicon-plus")){
                       $(div_selector).append(event_textbox);
                       $(this).find('span').removeClass('glyphicon-plus');
                       $(this).find('span').addClass('glyphicon-minus');
               }
               else $(this).parent().parent().remove();
       });                        
};

$(document).ready(function(){
       getData('#events','.event');
       getData('#states','.state');
});