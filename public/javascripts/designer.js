var paper = Raphael(100, 200, "80%", "70%");

var designer = {};

designer.states = [];
designer.transitionLines = [];


var stateDragger = function() {
	// Original coords for main element
	this.ox = this.type == "circle" ? this.attr("cx") : this.attr("x");
	this.oy = this.type == "circle" ? this.attr("cy") : this.attr("y");
	if (this.type != "text") this.animate({
		"fill-opacity": .2
	}, 500);

	// Original coords for pair element
	this.pair.ox = this.pair.type == "circle" ? this.pair.attr("cx") : this.pair.attr("x");
	this.pair.oy = this.pair.type == "circle" ? this.pair.attr("cy") : this.pair.attr("y");
	if (this.pair.type != "text") this.pair.animate({
		"fill-opacity": .2
	}, 500);
};

var moveState = function(dx, dy) {
	// Move main element
	var att = this.type == "circle" ? {
		cx: this.ox + dx,
		cy: this.oy + dy
	} : {
		x: this.ox + dx,
		y: this.oy + dy
	};
	this.attr(att);

	// Move paired element
	att = this.pair.type == "circle" ? {
		cx: this.pair.ox + dx,
		cy: this.pair.oy + dy
	} : {
		x: this.pair.ox + dx,
		y: this.pair.oy + dy
	};
	this.pair.attr(att);

	// Move Transition lines
	for (i = designer.transitionLines.length; i--;) {
		paper.connection(designer.transitionLines[i]);
	}
};
var up = function() {};

designer.drawState = function(x, y, name) {
	var state = paper.circle(x, y, 50).attr({
		fill: "#ffffff",
		stroke: "#000000",
		"fill-opacity": 0,
		"stroke-width": 2,
		cursor: "move"
	});

	var state_text = paper.text(x, y, name).attr({
		fill: "#000000",
		stroke: "none",
		"font-size": 15,
		cursor: "move"
	});

	state.pair = state_text;
	state_text.pair = state;

	state.drag(moveState, stateDragger, up);
	state_text.drag(moveState, stateDragger, up);
	designer.states.push(state);
	return state;
};

designer.addConnection = function(obj1, obj2, color) {
	var connection = paper.connection(obj1, obj2, color);
	designer.transitionLines.push(connection);
};

var init = function() {
	paper.clear();
	var rect = paper.rect(0, 0, "100%", "100%");
	rect.attr("stroke", "#000000");

	var s = designer.drawState(100, 100, "start");
	var f = designer.drawState(500, 200, "Final");

	designer.addConnection(s, f, '#000');
};

var addState = function() {
	designer.drawState(100, 100, "start");
};