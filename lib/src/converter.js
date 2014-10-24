var converter = {};
var dfa = require('./DFA.js').dfa;
var getAllKeys =function(json){
	return Object.keys(json);
};

var getStateByName = function(states, name) {
	var state = null;
	states.forEach(function(s){
		if(s.name == name)
			state = s;
	});
	return state;
};

var getAllStates = function(json){
	var stateNames = getAllKeys(json['transitions']);	

	var states = stateNames.map(function(StateName) {
  		return new dfa.State(StateName);
	})

	states.forEach(function(state) {
		json['inputSet'].split(',').forEach(function(input) {
			var name = json['transitions'][state.name][input];
			state.transitions[input] = getStateByName(states, name);
		});
	});

	return states;
};

converter.toJsObject = function (json) {
	var states = getAllStates(json);
	var startState = getStateByName(states, json['start']);
	var finalStates = json['final'].split(',').map(function(name){
		return getStateByName(states, name);
	});

	return new dfa.Machine(startState, finalStates, states);
};

exports.converter = converter;