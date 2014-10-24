var dfa = {};

dfa.State = function(name) {
	this.name = name;
	this.transitions = {};

	this.getStateForInput = function(input){
		return this.transitions[input];
	};
};

dfa.Machine = function(startState, finalStates, all) {
	this.current = startState;
	this.startState = startState;
	this.finalStates = finalStates;
	this.states = all;

	var self = this;

	this.isInputAccepted = function(text) {
		text.split('').forEach(function(input) {
			self.current = self.current.getStateForInput(input);
		});
		return finalStates.indexOf(self.current) != -1;
	};
};

exports.dfa = dfa;