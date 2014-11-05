var addInput = function(div_selector, button_selector) {
    $(div_selector).on('click', button_selector, function() {
        var event_textbox = $("<div />").append($(div_selector).children(':last').clone())
            .html();
        var text = $(div_selector).children(':last').find('input').val();
        if ($(this).find('span').hasClass("glyphicon-plus")) {
            if (text && (text.length == 1) && designer.inputSet.indexOf(text) == -1) {
                $(div_selector).append(event_textbox);
                designer.addInput(text);

                $(this).find('span').removeClass('glyphicon-plus');
                $(this).find('span').addClass('glyphicon-minus');
            }
        } else {
            inputText = $(this).parent().parent().find('input').val();
            designer.removeInput(inputText);
            $(this).parent().parent().remove();
        }
    });
};

var operateOnState = function(div_selector, button_selector) {
    $(div_selector).on('click', button_selector, function() {
        var event_textbox = $("<div />").append($(div_selector).children(':last').clone())
            .html();
        var text = $(div_selector).children(':last').find('input').val();
        if ($(this).find('span').hasClass("glyphicon-plus")) {
            if (text && !designer.getStateTemplateByText(text)) {
                addState(text);
                $(div_selector).append(event_textbox);

                $(this).find('span').removeClass('glyphicon-plus');
                $(this).find('span').addClass('glyphicon-minus');
            }
        } else {
            stateText = $(this).parent().parent().find('input').val();
            designer.removeState(stateText);
            $(this).parent().parent().remove();
        }
    });
};

var checkInputValid = function(input, inputButton) {
    $(inputButton).click(function() {
        var output = createAndCheckInput($(input).val());
        if ($(this).find('span').hasClass("glyphicon-play") && output) {
            $(this).find('span').removeClass('glyphicon-play');
            $(this).find('span').addClass('glyphicon-ok right');
        } else {
            $(this).find('span').removeClass('glyphicon-play');
            $(this).find('span').addClass('glyphicon-remove wrong');
        }
    });
    $(input).click(function() {
        $(inputButton).find('span').removeClass('glyphicon-ok right');
        $(inputButton).find('span').removeClass('glyphicon-remove wrong');
        $(inputButton).find('span').addClass('glyphicon-play');
    });
};


$(document).ready(function() {
    addInput('#events', '.event');
    operateOnState('#states', '.state');
    checkInputValid('#input', '#input-btn')
});