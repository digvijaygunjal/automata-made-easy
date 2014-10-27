var assert = chai.assert;

describe('#machine', function() {
	var state_S;
	var state_A;
	var state_B;
	var finalStates;
	var all;
	var machine;

	beforeEach(function() {
		state_S = new State("S");
		state_A = new State("A");
		state_B = new State("B");

		finalStates = [state_A];
		all = [state_S, state_A];
		machine = new Machine(state_S, finalStates, all);
		state_S.transitions = {
			'0': state_S,
			'1': state_A
		};
		state_A.transitions = {
			'0': state_S,
			'1': state_A
		};
	});

	it('machine should have all states', function() {
		assert.equal(machine.current, state_S);
		assert.deepEqual(machine.finalStates, finalStates);
		assert.deepEqual(machine.states, all);
	});

	describe('#acceptInput', function() {
		it('should move to next state on input', function() {
			machine.acceptInput('1');
			assert.deepEqual(machine.current, state_A);
		});
	});

	describe('#isInputAccepted', function() {
		it('should be true when input is accepted by machine', function() {
			assert.ok(machine.isInputAccepted('1'));
			assert.ok(machine.isInputAccepted('101'));
			assert.ok(machine.isInputAccepted('11111'));
			assert.ok(machine.isInputAccepted('010101'));
		});
	});
});