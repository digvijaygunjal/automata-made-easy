var dfa = require('../src/DFA.js').dfa;
var assert = require('assert');
var test = {};
exports.test = test;

test.a_state_has_name_and_transitions = function(){
	var state = new dfa.State("S");

	assert.equal(state.name, 'S');
	assert.deepEqual(state.transitions, {});
};