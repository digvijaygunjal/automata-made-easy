var designer = {};

designer.states = [];
designer.transitionLines = [];
designer.inputSet = ['0', '1'];
designer.startState = "A";

designer.circleAttrs = {
	fill: "#ffffff",
	stroke: "#000000",
	"fill-opacity": 0,
	"stroke-width": 2,
	cursor: "move"
};

designer.textAttrs = {
	fill: "#000000",
	stroke: "none",
	"font-size": 15,
	cursor: "move"
};

var stateDragger = function() {
	// Original coords for main element
	this.ox = this.type == "circle" ? this.attr("cx") : this.attr("x");
	this.oy = this.type == "circle" ? this.attr("cy") : this.attr("y");
	// Original coords for pair element
	this.pairs.forEach(function(pair) {
		pair.ox = pair.type == "circle" ? pair.attr("cx") : pair.attr("x");
		pair.oy = pair.type == "circle" ? pair.attr("cy") : pair.attr("y");
	});
};

var bubbleDragger = function() {
	// Original coords for main element
	this.ox = this.type == "circle" ? this.attr("cx") : this.attr("x");
	this.oy = this.type == "circle" ? this.attr("cy") : this.attr("y");
	// Original coords for pair element
	this.pairs.forEach(function(pair) {
		pair.ox = pair.type == "circle" ? pair.attr("cx") : pair.attr("x");
		pair.oy = pair.type == "circle" ? pair.attr("cy") : pair.attr("y");
	});
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
	this.pairs.forEach(function(pair) {
		att = pair.type == "circle" ? {
			cx: pair.ox + dx,
			cy: pair.oy + dy
		} : {
			x: pair.ox + dx,
			y: pair.oy + dy
		};
		pair.attr(att);
	});


	// Move Transition lines
	for (i = designer.transitionLines.length; i--;) {
		paper.connection(designer.transitionLines[i]);
	}
};

var moveBubble = function(dx, dy) {
	// Move main element
	var bubble = this;
	var att = bubble.type == "circle" ? {
		cx: bubble.ox + dx,
		cy: bubble.oy + dy
	} : {
		x: bubble.ox + dx,
		y: bubble.oy + dy
	};
	bubble.attr(att);

	// Move paired element
	var pair = bubble.pairs[0];
	att = pair.type == "circle" ? {
		cx: pair.ox + dx,
		cy: pair.oy + dy
	} : {
		x: pair.ox + dx,
		y: pair.oy + dy
	};
	pair.attr(att);
};

var up = function() {};

var dragBubbleToState = function(bubble, bubbleState) {
	bubble = bubble.type == "circle" ? bubble : bubble.pairs[0];
	bubbleText = bubble.pairs[0];

	bubble.cx = bubbleState.circle.attrs.cx + 60;
	bubble.cy = bubbleState.circle.attrs.cy;
	bubbleText.x = bubbleState.circle.attrs.cx + 60;
	bubbleText.y = bubbleState.circle.attrs.cy;

	var animateBubbleAttrs = {
		cx: bubble.cx,
		cy: bubble.cy
	};
	var animateBubbleTextAttrs = {
		x: bubbleText.x,
		y: bubbleText.y
	};
	
	bubble.animate(animateBubbleAttrs, 3000, "elastic");
	bubbleText.animate(animateBubbleTextAttrs, 3000, "elastic");
};

var bubbleDragEnd = function() {
	var bubble = this.type == 'circle' ? this : this.pairs[0];
	var bubbleState = designer.getStateTemplateByPair(bubble);
	var inputText = bubble.pairs[0].attrs.text;
	var stateFound = false;
	designer.states.forEach(function(state) {
		if (state.isPointInside(bubble.attrs.cx, bubble.attrs.cy)) {
			bubble.pairs.forEach(function(pair) {
				pair.hide();
			});
			bubble.hide();
			designer.addConnection(bubbleState.circle, state.circle, inputText, "#000000");
			stateFound = true;
		}
	});
	if (!stateFound) dragBubbleToState(bubble, bubbleState);
};

var stateTemplate = function(circle, text, innerCircle, inputBubbles) {
	var self = this;
	self.circle = circle;
	self.text = text;
	self.innerCircle = innerCircle;
	self.inputBubbles = inputBubbles;
	self.isFinal = false;

	var toggleInnerCircle = function() {
		if (self.isFinal)
			self.innerCircle.hide();
		else
			self.innerCircle.show();
		self.isFinal = !self.isFinal;
	};

	self.circle.dblclick(toggleInnerCircle);
	self.text.dblclick(toggleInnerCircle);
	self.innerCircle.dblclick(toggleInnerCircle);

	self.isPointInside = function(x, y) {
		return this.circle.isPointInside(x, y) || this.innerCircle.isPointInside(x, y) || this.text.isPointInside(x, y);
	};

	self.name = function() {
		return self.text.attrs.text;
	};
};

designer.getStateTemplateByPair = function(pair) {
	var pairState;
	designer.states.forEach(function(state) {
		if ((state.circle == pair) || (state.circle.pairs.indexOf(pair) != -1)) {
			pairState = state;
		}
	});
	return pairState;
};

designer.getStateTemplateByText = function(name) {
	var existing = false;
	designer.states.forEach(function(state) {
		if (name == state.text.attrs['text']) existing = true;
	});
	return existing;
};

designer.drawInputBubbles = function(circle, text, innerCircle, x, y) {
	return designer.inputSet.map(function(inputText) {
		var bX = x + 45;
		var bY = y + 45;

		var inputBubble = paper.circle(bX, bY, 10).attr(designer.circleAttrs);
		var inputBubbleText = paper.text(bX, bY, inputText).attr(designer.textAttrs);

		inputBubble.pairs = [inputBubbleText];
		inputBubbleText.pairs = [inputBubble];

		inputBubble.drag(moveBubble, bubbleDragger, bubbleDragEnd);
		inputBubbleText.drag(moveBubble, bubbleDragger, bubbleDragEnd);

		circle.pairs.push(inputBubble);
		circle.pairs.push(inputBubbleText);
		text.pairs.push(inputBubble);
		text.pairs.push(inputBubbleText);
		innerCircle.pairs.push(inputBubble);
		innerCircle.pairs.push(inputBubbleText);
		return inputBubble;
	});
};

designer.drawState = function(x, y, name) {
	var circle = paper.circle(x, y, 40).attr(designer.circleAttrs);
	circle.ox = x;
	circle.oy = y;

	var text = paper.text(x, y, name).attr(designer.textAttrs);
	var innerCircle = paper.circle(circle.attrs.cx, circle.attrs.cy, 30).attr(designer.circleAttrs);
	var inputBubbles = [];

	circle.pairs = [text, innerCircle];
	text.pairs = [circle, innerCircle];
	innerCircle.pairs = [circle, text];

	circle.drag(moveState, stateDragger, up);
	text.drag(moveState, stateDragger, up);
	innerCircle.drag(moveState, stateDragger, up);
	innerCircle.hide();

	inputBubbles = designer.drawInputBubbles(circle, text, innerCircle, x, y);

	var state = new stateTemplate(circle, text, innerCircle, inputBubbles);
	designer.states.push(state);
	return state;
};

designer.addConnection = function(obj1, obj2, input, color) {
	var connection = paper.connection(obj1, obj2, input, color);
	designer.transitionLines.push(connection);
};

designer.createJson = function() {
	var json = {};
	var allFinals = designer.states.filter(function(state) {
		return state.isFinal;
	});
	var transitions = {};

	json['start'] = designer.startState;
	json['inputSet'] = designer.inputSet.join(',');
	json['final'] = allFinals.map(function(state) {
		return state.name();
	}).join(",");

	designer.transitionLines.forEach(function(transitionLine) {
		var from = designer.getStateTemplateByPair(transitionLine.from).name();
		var to = designer.getStateTemplateByPair(transitionLine.to).name();
		var input = transitionLine.input;
		transitions[from] || (transitions[from] = {});
		transitions[from][input] = to;
	});

	json['transitions'] = transitions;
	return json;
};