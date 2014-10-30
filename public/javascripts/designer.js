var paper = Raphael(100, 200, "80%", "70%");

var designer = {};

designer.states = [];
designer.transitionLines = [];

var stateDragger = function() {
	// Original coords for main element
	this.ox = this.type == "circle" ? this.attr("cx") : this.attr("x");
	this.oy = this.type == "circle" ? this.attr("cy") : this.attr("y");
	// Original coords for pair element
	this.pair.ox = this.pair.type == "circle" ? this.pair.attr("cx") : this.pair.attr("x");
	this.pair.oy = this.pair.type == "circle" ? this.pair.attr("cy") : this.pair.attr("y");
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

var stateTemplate = function(circle, text, innerCircle) {
	this.circle = circle;
	this.text = text;
	this.innerCircle = innerCircle;
};

designer.getStateTemplateByText = function(name) {
	var existing = false;
	designer.states.forEach(function(state) {
		if (name == state.text.attrs['text']) existing = true;
	});
	return existing;
};

designer.drawState = function(x, y, name) {
	var circle = paper.circle(x, y, 50).attr({
		fill: "#ffffff",
		stroke: "#000000",
		"fill-opacity": 0,
		"stroke-width": 2,
		cursor: "move"
	});

	var text = paper.text(x, y, name).attr({
		fill: "#000000",
		stroke: "none",
		"font-size": 15,
		cursor: "move"
	});

	circle.dblclick(function() {
		paper.circle(circle.attrs.cx, circle.attrs.cy, 40).attr({
			fill: "#ffffff",
			stroke: "#000000",
			"fill-opacity": 0,
			"stroke-width": 2,
			cursor: "move"
		});
	});

	circle.pair = text;
	text.pair = circle;

	circle.drag(moveState, stateDragger, up);
	text.drag(moveState, stateDragger, up);

	var state = new stateTemplate(circle, text);
	designer.states.push(state);
	return state;
};

designer.addConnection = function(obj1, obj2, color) {
	var connection = paper.connection(obj1, obj2, color);
	designer.transitionLines.push(connection);
};

var addState = function() {
	var name = document.getElementById('state-name').value;
	if (!designer.getStateTemplateByText(name) && name) {
		designer.drawState(100, 100, name);
	}
};

var addTransitionLine = function() {
	designer.states.forEach(function(state) {
		designer.states.forEach(function(state2) {
			designer.addConnection(state.circle, state2.circle, "#000000");
		});
	});
};

var init = function() {
	paper.clear();
	var rect = paper.rect(0, 0, "100%", "100%");
	rect.attr("stroke", "#000000");
};