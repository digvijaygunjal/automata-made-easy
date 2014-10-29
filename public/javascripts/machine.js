var Machine = function(startState, finalStates, all) {
	var self = this;
	self.current = startState;
	self.startState = startState;
	self.finalStates = finalStates;
	self.states = all;

	self.acceptInput = function(input) {
		if(!self.current) return false;
		self.current = self.current.getStateForInput(input);
	};

	self.isInputAccepted = function(text) {
		text.split('').forEach(function(input) {
			if(!self.acceptInput(input)) return false;
			self.acceptInput(input);
		});
		var result = finalStates.indexOf(self.current) != -1;
		self.current = self.startState;
		return result;
	};
};