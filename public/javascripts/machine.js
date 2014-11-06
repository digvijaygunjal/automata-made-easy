var Machine = function(startState, finalStates, all) {
	var self = this;
	self.current = startState;
	self.startState = startState;
	self.finalStates = finalStates;
	self.states = all;

	self.acceptInput = function(input) {
		if(!self.current) return false;
		self.current = self.current.getStateForInput(input);
		return true;
	};

	self.isInputAccepted = function(text) {
		var result = true;
		if(!self.startState) return false;		
		text.split('').forEach(function(input) {
			result  = self.acceptInput(input);
		});


		if(!result) return result;
		result = (finalStates.indexOf(self.current) != -1);
		self.current = self.startState;
		return result;
	};
};