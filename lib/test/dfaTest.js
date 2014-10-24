var dfa = require('../src/DFA.js').dfa;
var assert = require('assert');
var test = {};
exports.test = test;

test.a_state_has_name_and_transitions = function() {
	var state = new dfa.State("S");

	assert.equal(state.name, 'S');
	assert.deepEqual(state.transitions, {});
};

test.machine_should_have_all_states = function() {
	var state_S = new dfa.State("S");
	var state_A = new dfa.State("A");
	var state_B = new dfa.State("B");
	var finalStates = [state_S, state_B];
	var all = [state_S, state_A, state_B];

	var machine = new dfa.Machine(state_S, finalStates, all);

	assert.equal(machine.startState, state_S);
	assert.equal(machine.finalStates, finalStates);
	assert.equal(machine.states, all);
};

test.current_state_of_machine_should_be_start_state = function() {
	var state_S = new dfa.State("S");

	var machine = new dfa.Machine(state_S, [state_S], [state_S]);

	assert.equal(machine.current, state_S);
};

test.machine_accepts_strings_ending_with_1 = function() {
	var state_S = new dfa.State("S");
	var state_A = new dfa.State("A");

	state_S.transitions = {
		'0': state_S,
		'1': state_A
	};
	state_A.transitions = {
		'0': state_S,
		'1': state_A
	};

	var machine = new dfa.Machine(state_S, [state_A], [state_S, state_A]);

	assert.ok(machine.isInputAccepted('1'));
	assert.ok(machine.isInputAccepted('101'));
	assert.ok(machine.isInputAccepted('11111'));
	assert.ok(machine.isInputAccepted('010101'));
};

test.machine_rejects_strings_ending_with_0 = function() {
	var state_S = new dfa.State("S");
	var state_A = new dfa.State("A");

	state_S.transitions = {
		'0': state_S,
		'1': state_A
	};
	state_A.transitions = {
		'0': state_S,
		'1': state_A
	};

	var machine = new dfa.Machine(state_S, [state_A], [state_S, state_A]);

	assert.ok(machine.isInputAccepted('1'));
	assert.ok(!machine.isInputAccepted('0'));
	assert.ok(!machine.isInputAccepted('1010'));
	assert.ok(!machine.isInputAccepted('111110'));
	assert.ok(!machine.isInputAccepted('0101010'));
};

test.current_state_of_machine_is_current_after_it_checks_input = function() {
	var state_S = new dfa.State("S");
	var state_A = new dfa.State("A");

	state_S.transitions = {
		'0': state_S,
		'1': state_A
	};
	state_A.transitions = {
		'0': state_S,
		'1': state_A
	};

	var machine = new dfa.Machine(state_S, [state_A], [state_S, state_A]);

	assert.ok(machine.isInputAccepted('1'));
	assert.equal(machine.current, state_S);
};

