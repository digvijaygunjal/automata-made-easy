var paper = Raphael(100, 200, "80%", "70%");

var designer = {};

designer.states = [];
designer.transitionLines = [];
designer.inputSet = ['0', '1'];
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


designer.getStateByBubble = function(bubble){
	var bubbleState;
	designer.states.forEach(function(state){
		if(state.circle.pairs.indexOf(bubble) != -1){
			console.log("state mil gaya bhai");
			bubbleState = state;
		}
	});
	return bubbleState;
};

var stateDragger = function() {
	// Original coords for main element
	this.ox = this.type == "circle" ? this.attr("cx") : this.attr("x");
	this.oy = this.type == "circle" ? this.attr("cy") : this.attr("y");
	// Original coords for pair element
	this.pairs.forEach(function(pair){
		pair.ox = pair.type == "circle" ? pair.attr("cx") : pair.attr("x");
		pair.oy = pair.type == "circle" ? pair.attr("cy") : pair.attr("y");
	});
};

var bubbleDragger = function(){
	// Original coords for main element
	this.ox = this.type == "circle" ? this.attr("cx") : this.attr("x");
	this.oy = this.type == "circle" ? this.attr("cy") : this.attr("y");
	// Original coords for pair element
	this.pairs.forEach(function(pair){
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
	this.pairs.forEach(function(pair){
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

var moveBubble = function(dx, dy){
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
	bubble.pairs.forEach(function(pair){
		att = pair.type == "circle" ? {
			cx: pair.ox + dx,
			cy: pair.oy + dy
		} : {
			x: pair.ox + dx,
			y: pair.oy + dy
		};
		pair.attr(att);
	});

	// draw transition Line
	designer.states.forEach(function(state) {
		if(state.circle.isPointInside(bubble.ox, bubble.oy)) {
			
			designer.transitionLines.push(paper.connection(designer.getStateByBubble(bubble).circle, state.circle, "#000000"));
		}
	});
};

var up = function() {};

var bubbleDragEnd = function(){};


var stateTemplate = function(circle, text, innerCircle, inputBubbles) {
	var self = this;
	self.circle = circle;
	self.text = text;
	self.innerCircle = innerCircle;
	self.inputBubbles = inputBubbles;
	self.isFinal = false;

	var drawInnerCircle = function() {
		if(self.isFinal)
			self.innerCircle.hide();
		else
			self.innerCircle.show();
		self.isFinal = !self.isFinal;
	};

	self.circle.dblclick(drawInnerCircle);
	self.text.dblclick(drawInnerCircle);
	self.innerCircle.dblclick(drawInnerCircle);
};

designer.getStateTemplateByText = function(name) {
	var existing = false;
	designer.states.forEach(function(state) {
		if (name == state.text.attrs['text']) existing = true;
	});
	return existing;
};

designer.drawInputBubbles = function(circle, text, innerCircle, x, y){
	return designer.inputSet.map(function(inputText){
		var bX = x + 45;
		var bY = y + 45;

		var inputBubble  = paper.circle(bX, bY, 10).attr(designer.circleAttrs);
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

var addTransitionLines = function() {
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