var converter = require('../src/converter.js').converter;
var dfa = require('../src/DFA.js').dfa;
var assert = require('assert');
var test = {};
exports.test = test;


test.create_a_dfa_Machine_from_json_for_single_final_state = function() {
	var json = JSON.parse('{"start":"S","final":"A","inputSet":"0,1","transitions":{"S":{"0":"A","1":"S"},"A":{"0":"S","1":"A"}}}');

	var dfaMachine = converter.toJsObject(json);

	assert.equal(dfaMachine.startState.name, "S");
	assert.equal(dfaMachine.finalStates[0].name, "A");
};

test.create_a_dfa_Machine_from_json_for_multiple_final_states = function() {
	var json = JSON.parse('{"start":"S","final":"S,A","inputSet":"0,1","transitions":{"S":{"0":"A","1":"S"},"A":{"0":"S","1":"A"}}}');

	var dfaMachine = converter.toJsObject(json);

	assert.equal(dfaMachine.startState.name, "S");
	assert.equal(dfaMachine.finalStates.length, 2);
	assert.equal(dfaMachine.finalStates[0].name, "S");
	assert.equal(dfaMachine.finalStates[1].name, "A");
};

