var designer = {};
var angle = 10;

designer.states = [];
designer.transitions = [];
designer.inputSet = [];
designer.startState = "Start";

designer.circleAttrs = {
	fill: "#ffffff",
	stroke: "#000000",
	"stroke-width": 2,
	cursor: "move"
};

designer.textAttrs = {
	fill: "#000000",
	stroke: "none",
	"font-size": 15,
	cursor: "move"
};

var overlap = function(circ1, circ2) {
	var attrs = ["cx", "cy", "r"];
	var c1 = circ1.attr(attrs);
	var c2 = circ2.attr(attrs);
	var dist = Math.sqrt(Math.pow(c1.cx - c2.cx, 2) + Math.pow(c1.cy - c2.cy, 2));
	return (dist < (c1.r + c2.r));
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
	for (i = designer.transitions.length; i--;) {
		paper.connection(designer.transitions[i]);
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

	var bX = bubbleState.circle.attrs.cx + 60;
	var bY = bubbleState.circle.attrs.cy;

	bubbleState.inputBubbles.forEach(function(bubble) {
		if (bubble.circle.isPointInside(bX, bY)) {
			bX = (bubbleState.circle.attrs.cx + 60 * Math.cos(angle));
			bY = (bubbleState.circle.attrs.cy + 60 * Math.sin(angle));
			angle += 10;
		}
	});

	bubble.cx = bX;
	bubble.cy = bY;
	bubbleText.x = bX;
	bubbleText.y = bY;

	var animateBubbleAttrs = {
		cx: bubble.cx,
		cy: bubble.cy
	};
	var animateBubbleTextAttrs = {
		x: bubbleText.x,
		y: bubbleText.y
	};

	bubble.animate(animateBubbleAttrs, 1000, "elastic");
	bubbleText.animate(animateBubbleTextAttrs, 1000, "elastic");
};

var bubbleDragEnd = function() {
	var bubble = this.type == 'circle' ? this : this.pairs[0];
	var bubbleState = designer.getStateTemplateByBubble(bubble);
	var inputText = bubble.pairs[0].attrs.text;
	var stateFound = false;
	designer.states.forEach(function(state) {
		if (state.isPointInside(bubble.attrs.cx, bubble.attrs.cy)) {
			bubble.pairs.forEach(function(pair) {
				pair.hide();
			});
			bubble.hide();
			designer.addConnection(bubbleState.circle, state.circle, bubble, "#000000");
			stateFound = true;
		}
	});
	if (!stateFound) dragBubbleToState(bubble, bubbleState);
};

var inputBubble = function(circle, text) {
	var self = this;
	self.circle = circle;
	self.circle.pairs = [text];
	self.text = text;
	self.text.pairs = [circle];

	self.inputText = function() {
		return self.text.attrs.text;
	};

	self.remove = function() {
		self.circle.hide();
		self.text.hide();
	};

	return self;
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

	self.remove = function() {
		designer.removeTransitionsForState(self);
		self.circle.pairs.forEach(function(pair) {
			pair.hide();
		});
		self.circle.hide();
	};

	self.addPair = function(pair) {
		self.circle.pairs.push(pair);
		self.text.pairs.push(pair);
		self.innerCircle.pairs.push(pair);
	};

	self.removePair = function(pair) {
		self.circle.pairs.pop(pair);
		self.text.pairs.pop(pair);
		self.innerCircle.pairs.pop(pair);
	};

	self.getInputBubbleByText = function(text) {
		var bubble = null;
		self.inputBubbles.forEach(function(inputBubble) {
			if (inputBubble.inputText() == text) {
				bubble = inputBubble;
			}
		});
		return bubble;
	};

	self.removeInputBubble = function(text) {
		var inputBubbleTemp = self.getInputBubbleByText(text);
		self.inputBubbles = self.inputBubbles.filter(function(inputBubble) {
			return inputBubble.inputText() != inputBubbleTemp.inputText();
		});

		self.removePair(inputBubbleTemp.circle);
		self.removePair(inputBubbleTemp.text);
		designer.transitions.forEach(function(transition) {
			if(inputBubbleTemp.circle == transition.input){
				transition.line.hide();
				designer.transitions.pop(transition);
			}
		});
		inputBubbleTemp.remove();
	};
};

designer.addInput = function(text) {
	designer.inputSet.push(text);
	designer.states.forEach(function(state) {
		var bX = state.circle.ox + 60;
		var bY = state.circle.oy;

		state.inputBubbles.forEach(function(bubble) {
			if (bubble.circle.isPointInside(bX, bY)) {
				bX = (state.circle.ox + 60 * Math.cos(angle));
				bY = (state.circle.oy + 60 * Math.sin(angle));
				angle += 10;
			}
		});

		var bubbleCircle = paper.circle(bX, bY, 10).attr(designer.circleAttrs);
		var inputBubbleText = paper.text(bX, bY, text).attr(designer.textAttrs);

		bubbleCircle.drag(moveBubble, bubbleDragger, bubbleDragEnd);
		inputBubbleText.drag(moveBubble, bubbleDragger, bubbleDragEnd);

		state.addPair(bubbleCircle);
		state.addPair(inputBubbleText);
		state.inputBubbles.push(new inputBubble(bubbleCircle, inputBubbleText));
	});
};

designer.removeInput = function(inputText) {
	designer.inputSet.pop(inputText);
	designer.states.forEach(function(state) {
		state.removeInputBubble(inputText);
	});
};

designer.removeTransitionsForState = function(state) {
	var transitionsToDelete = [];
	designer.transitions.forEach(function(transition) {
		if (transition.from == state.circle || transition.to == state.circle)
			transitionsToDelete.push(transition);
	});

	transitionsToDelete.forEach(function(transition) {
		var stateTemplate = designer.getStateTemplateByBubble(transition.input);
		dragBubbleToState(transition.input, stateTemplate);
		transition.line.hide();
		transition.line.remove();
		transition.input.show();
		transition.input.pairs[0].show();
		designer.transitions.pop(transition);
	});
};

designer.getStateTemplateByPair = function(pair) {
	var pairState = null;
	designer.states.forEach(function(state) {
		if ((state.circle == pair) || (state.circle.pairs.indexOf(pair) != -1)) {
			pairState = state;
		}
	});
	return pairState;
};

designer.getStateTemplateByBubble = function(bubbleCircle) {
	var bubbleState = null;
	designer.states.forEach(function(state) {
		state.inputBubbles.forEach(function(inputBubble) {
			if (inputBubble.circle == bubbleCircle)
				bubbleState = state;
		});
	});
	return bubbleState;
};

designer.getStateTemplateByText = function(name) {
	var stateTemplate = false;
	designer.states.forEach(function(state) {
		if (name == state.text.attrs['text']) stateTemplate = state;
	});
	return stateTemplate;
};

designer.drawInputBubbles = function(state, x, y) {
	var inputBubbles = [];
	designer.inputSet.map(function(inputText) {
		var bX = x + 60;
		var bY = y;

		inputBubbles.forEach(function(bubble) {
			if (bubble.circle.isPointInside(bX, bY)) {
				bX = (state.circle.ox + 60 * Math.cos(angle));
				bY = (state.circle.oy + 60 * Math.sin(angle));
				angle += 10;
			}
		});

		var bubbleCircle = paper.circle(bX, bY, 10).attr(designer.circleAttrs);
		var inputBubbleText = paper.text(bX, bY, inputText).attr(designer.textAttrs);

		bubbleCircle.drag(moveBubble, bubbleDragger, bubbleDragEnd);
		inputBubbleText.drag(moveBubble, bubbleDragger, bubbleDragEnd);

		state.addPair(bubbleCircle);
		state.addPair(inputBubbleText);

		inputBubbles.push(new inputBubble(bubbleCircle, inputBubbleText));
	});
	return inputBubbles;
};

designer.drawState = function(x, y, name) {
	designer.states.forEach(function(state) {
		if (x >= paper.canvas.offsetWidth - 100) {
			x = 100;
			y += 200;
		}
		if (state.isPointInside(x, y)) {
			x += 150;
		}
	});

	var circle = paper.circle(x, y, 40).attr(designer.circleAttrs);
	circle.ox = x;
	circle.cx = x;
	circle.oy = y;
	circle.cy = y;

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

	var state = new stateTemplate(circle, text, innerCircle);

	state.inputBubbles = designer.drawInputBubbles(state, x, y);
	designer.states.push(state);
	return state;
};

designer.addConnection = function(obj1, obj2, input, color) {
	var connection = paper.connection(obj1, obj2, input, color);
	designer.transitions.push(connection);
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

	designer.transitions.forEach(function(transitionLine) {
		var from = designer.getStateTemplateByPair(transitionLine.from).name();
		var to = designer.getStateTemplateByPair(transitionLine.to).name();
		var input = transitionLine.input.pairs[0].attrs.text;
		transitions[from] || (transitions[from] = {});
		transitions[from][input] = to;
	});

	json['transitions'] = transitions;
	return json;
};

designer.removeState = function(name) {
	var state = designer.getStateTemplateByText(name);
	state.remove();
	designer.states = designer.states.filter(function(state) {
		return state.name() != name;
	});
};