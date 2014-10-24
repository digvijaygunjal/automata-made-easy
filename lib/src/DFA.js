var dfa = {};

dfa.State = function(name) {
	this.name = name;
	this.transitions = {};

	this.getStateForInput = function(input) {
		return this.transitions[input];
	};
};

dfa.Machine = function(startState, finalStates, all) {
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

exports.dfa = dfa;