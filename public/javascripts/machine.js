function machine(startState, finalStates, all) {
	var self = this;
	this.current = startState;
	this.startState = startState;
	this.finalStates = finalStates;
	this.states = all;

	this.isInputAccepted = function(text) {
		text.split('').forEach(function(input) {
			self.current = self.current.getStateForInput(input);
		});
		var result = finalStates.indexOf(self.current) != -1;
		self.current = self.startState;
		return result;
	};
};