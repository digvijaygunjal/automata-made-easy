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
                $(this).parent().parent().find('input').prop('disabled', true);
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
        var newDiv = $(div_selector).children(':last').clone();
        newDiv.find('input').attr('value','');
        newDiv.find('input').prop('disabled',false);

        var event_textbox = $("<div />").append(newDiv).html();
        var text = $(div_selector).children(':last').find('input').val();

        if ($(this).find('span').hasClass("glyphicon-plus")) {
            if (text && !designer.getStateTemplateByText(text)) {
                addState(text);
                $(div_selector).append(event_textbox);

                $(this).find('span').removeClass('glyphicon-plus');
                $(this).find('span').addClass('glyphicon-minus');
                $(this).parent().parent().find('input').prop('disabled', true);

            }
        } else {
            stateText = $(this).parent().parent().find('input').val();
            designer.removeState(stateText);
            $(this).parent().parent().remove();
        }
        $(div_selector).children().eq(1).find('button').prop('disabled',true);

    });
};

var checkInputValid = function(input, inputButton) {
    $(inputButton).click(function() {
        var output = createAndCheckInput($(input).val());
        if ($(this).find('span').hasClass("glyphicon-play") && output) {
            $(this).find('span').removeClass('glyphicon-play');
            $(this).find('span').addClass('glyphicon-ok right');
            $('#input-btn').prop('disabled', true);

        } else {
            $(this).find('span').removeClass('glyphicon-play');
            $(this).find('span').addClass('glyphicon-remove wrong');
            $('#input-btn').prop('disabled', true);
        }
    });
    $(input).click(function() {
        $(inputButton).find('span').removeClass('glyphicon-ok right');
        $(inputButton).find('span').removeClass('glyphicon-remove wrong');
        $(inputButton).find('span').addClass('glyphicon-play');
        $('#input-btn').prop('disabled', false);

    });
};

var EnableInputDiv = function(state_selector, state_button, event_selector, event_button) {
    var numberOfStates;
    var numberOfEvents;
    $(state_selector).on('click', state_button, function() {
        numberOfStates = $(state_selector).children('.input-group').length;
        if (numberOfStates > 1 && numberOfEvents > 1) {
            $('#input').prop('disabled', false);
            $('#input-btn').prop('disabled', false);
        } else {
            $('#input').prop('disabled', true);
            $('#input').val('');
        }
    });
    $(event_selector).on('click', event_button, function() {
        numberOfEvents = $(event_selector).children('.input-group').length;
        if (numberOfStates > 1 && numberOfEvents > 1) {
            $('#input').prop('disabled', false);
            $('#input-btn').prop('disabled', false);
        } else {
            $('#input').prop('disabled', true);
            $('#input').val('');
        }
    });

}



$(document).ready(function() {
    addInput('#events', '.event', '#input-div');
    operateOnState('#states', '.state', '#input-div');
    checkInputValid('#input', '#input-btn');
    EnableInputDiv('#states', '.state', '#events', '.event');

});