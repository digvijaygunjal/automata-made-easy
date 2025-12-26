// Sanitize input to prevent XSS
var sanitizeInput = function(input) {
    if (typeof input !== 'string') return '';
    // Remove potentially dangerous characters and limit length
    return input.replace(/[<>\"'&]/g, '').substring(0, 100).trim();
};

var addInput = function(div_selector, button_selector) {
    $(div_selector).on('click', button_selector, function() {
        var event_textbox = $("<div />").append($(div_selector).children(':last').clone())
            .html();
        var text = $(div_selector).children(':last').find('input').val();
        var sanitizedText = sanitizeInput(text);
        
        if ($(this).find('span').hasClass("glyphicon-plus")) {
            // Validate: single character, alphanumeric only, not duplicate
            if (sanitizedText && 
                sanitizedText.length === 1 && 
                /^[a-zA-Z0-9]$/.test(sanitizedText) &&
                designer.inputSet.indexOf(sanitizedText) == -1) {
                $(div_selector).append(event_textbox);
                designer.addInput(sanitizedText);

                $(this).find('span').removeClass('glyphicon-plus');
                $(this).find('span').addClass('glyphicon-minus');
                $(this).parent().parent().find('input').prop('disabled', true);
            } else if (sanitizedText && sanitizedText.length !== 1) {
                alert('Input symbol must be exactly one character');
            } else if (sanitizedText && !/^[a-zA-Z0-9]$/.test(sanitizedText)) {
                alert('Input symbol must be alphanumeric');
            }
        } else {
            inputText = $(this).parent().parent().find('input').val();
            var sanitizedInputText = sanitizeInput(inputText);
            designer.removeInput(sanitizedInputText);
            $(this).parent().parent().remove();
        }
    });
};

var operateOnState = function(div_selector, button_selector) {
    $(div_selector).on('click', button_selector, function() {
        var newDiv = $(div_selector).children(':last').clone();
        newDiv.find('input').attr('value', '');
        newDiv.find('input').prop('disabled', false);

        var event_textbox = $("<div />").append(newDiv).html();
        var text = $(div_selector).children(':last').find('input').val();
        var sanitizedText = sanitizeInput(text);

        if ($(this).find('span').hasClass("glyphicon-plus")) {
            // Validate: non-empty, alphanumeric, reasonable length, not duplicate
            if (sanitizedText && 
                sanitizedText.length > 0 && 
                sanitizedText.length <= 50 &&
                /^[a-zA-Z0-9_]+$/.test(sanitizedText) &&
                !designer.getStateTemplateByText(sanitizedText)) {
                addState(sanitizedText);
                $(div_selector).append(event_textbox);

                $(this).find('span').removeClass('glyphicon-plus');
                $(this).find('span').addClass('glyphicon-minus');
                $(this).parent().parent().find('input').prop('disabled', true);
            } else if (sanitizedText && sanitizedText.length > 50) {
                alert('State name must be 50 characters or less');
            } else if (sanitizedText && !/^[a-zA-Z0-9_]+$/.test(sanitizedText)) {
                alert('State name must contain only alphanumeric characters and underscores');
            }
        } else {
            stateText = $(this).parent().parent().find('input').val();
            var sanitizedStateText = sanitizeInput(stateText);
            designer.removeState(sanitizedStateText);
            $(this).parent().parent().remove();
        }
        $(div_selector).children().eq(1).find('button').prop('disabled', true);

    });
};

var checkInputValid = function(input, inputButton) {
    $(inputButton).click(function() {
        var inputValue = $(input).val();
        var sanitizedInput = sanitizeInput(inputValue);
        
        // Limit input length to prevent DoS
        if (sanitizedInput.length > 1000) {
            alert('Input string is too long. Maximum 1000 characters allowed.');
            return;
        }
        
        // Validate input contains only allowed characters
        if (sanitizedInput && !/^[a-zA-Z0-9\s]*$/.test(sanitizedInput)) {
            alert('Input contains invalid characters. Only alphanumeric characters and spaces are allowed.');
            return;
        }
        
        var output = createAndCheckInput(sanitizedInput);
        designer.animateFlow(sanitizedInput);
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
    $('#myModal').modal('show');

    $("#input").keyup(function(event) {
        var inputButton = '#input-btn';
        if (event.keyCode == 13) {
            $("#input-btn").click();
        } else {
            $(inputButton).find('span').removeClass('glyphicon-ok right');
            $(inputButton).find('span').removeClass('glyphicon-remove wrong');
            $(inputButton).find('span').addClass('glyphicon-play');
            $('#input-btn').prop('disabled', false);
        }
    });
});