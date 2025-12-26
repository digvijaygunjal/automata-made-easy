var dfaMachine = null;

// Sanitize input to prevent XSS
var sanitizeInput = function(input) {
	if (typeof input !== 'string') return '';
	// Remove potentially dangerous characters
	return input.replace(/[<>\"']/g, '');
};

// Validate JSON structure
var validateMachineJson = function(json) {
	if (!json || typeof json !== 'object') return false;
	if (!json.start || typeof json.start !== 'string') return false;
	if (!json.inputSet || typeof json.inputSet !== 'string') return false;
	if (!json.final || typeof json.final !== 'string') return false;
	if (!json.transitions || typeof json.transitions !== 'object') return false;
	return true;
};

var drawDfa = function() {
	try {
		var textJson = document.getElementById('text-box').value;
		if (!textJson || textJson.trim() === '') {
			alert('Please enter a valid JSON');
			return;
		}
		var json = JSON.parse(textJson);
		if (!validateMachineJson(json)) {
			alert('Invalid machine JSON structure');
			return;
		}
		dfaMachine = MachineParser.createMachine(json);
	} catch (e) {
		alert('Error parsing JSON: ' + e.message);
		console.error('JSON parse error:', e);
	}
};

var checkInput = function(text) {
	if (dfaMachine == null) {
		alert('DFA not created.\nPlease create a valid DFA');
		return;
	}
	var input = text || document.getElementById('input').value;
	if (!input || typeof input !== 'string') {
		alert('Invalid input');
		return false;
	}
	// Sanitize and validate input - only allow alphanumeric and common symbols
	var sanitizedInput = input.trim().replace(/[^a-zA-Z0-9\s]/g, '');
	if (sanitizedInput !== input.trim()) {
		alert('Input contains invalid characters. Only alphanumeric characters are allowed.');
		return false;
	}
	var isInputAccepted = dfaMachine.isInputAccepted(sanitizedInput);
	return isInputAccepted;
};

var createAndCheckInput = function(text) {
	var json = designer.createJson();
	dfaMachine = MachineParser.createMachine(json);
	return checkInput(text);
};

var drawCircle = function(paper, x, y, radius) {
	var circle = paper.circle(x, y, radius);
	circle.attr("fill", "#ffffff");
	circle.attr("stroke", "#000000");
	return circle;
};

var createDfa = function() {
	var x = 0;
	var y = 100;
	var radius = 35;
	var allStates = [];

	paper.clear();
	var rect = paper.rect(0, 0, 320, 200);
	rect.attr("stroke", "#000000");
	var path_start = paper.path("M120,100 H50,85");
	path_start.attr({
		stroke: '#000000',
		'stroke-width': 2,
		'arrow-end': 'classic-wide-long'
	});

	dfaMachine.states.forEach(function(state) {
		x += 120;
		allStates.push(drawCircle(paper, x, y, radius));

		if (dfaMachine.finalStates.indexOf(state) != -1)
			drawCircle(paper, x, y, 25);
		// Sanitize state name before rendering
		var safeStateName = sanitizeInput(state.name);
		paper.text(x, y, safeStateName);
	});

	var text = "M" + (x - radius) + "," + y + " H" + (x - 120 + radius) + "," + (x - radius) + "";
	var path = paper.path(text);
	path.attr({
		stroke: '#000000',
		'stroke-width': 2,
		'arrow-end': 'classic-wide-long'
	});
};