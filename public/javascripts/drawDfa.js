var dfaMachine = null;

var drawDfa = function() {
	var textJson = document.getElementById('text-box').value;
	var json = JSON.parse(textJson)
	dfaMachine = MachineParser.createMachine(json);
};

var checkInput = function() {
	if (dfaMachine == null) {
		alert('DFA not created.\nPlease create a valid DFA');
		return;
	}
	var input = document.getElementById('input-box').value;
	console.log(dfaMachine.isInputAccepted(input.trim()));
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
		paper.text(x, y, state.name);
	});

	var text = "M" + (x - radius) + "," + y + " H" + (x - 120 + radius) + "," + (x - radius) + "";
	var path = paper.path(text);
	path.attr({
		stroke: '#000000',
		'stroke-width': 2,
		'arrow-end': 'classic-wide-long'
	});
};