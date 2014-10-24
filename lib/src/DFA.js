var dfa = {};

dfa.State = function (name) {
	this.name = name;
	this.transitions = {};
};

dfa.Machine = function (startState, finalStates, all) {
	this.startState =  startState;
	this.finalStates = finalStates;
	this.allStates = all;
};

exports.dfa = dfa;