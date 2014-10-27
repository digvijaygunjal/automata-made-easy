var assert = chai.assert;

describe('#state', function() {
	var state_S;

	beforeEach(function() {
		state_S = new State('Start');
	});

	it('should have a name', function() {
		assert.equal(state_S.name, 'Start');
	});

	it('should have empty transitions', function() {
		assert.deepEqual(state_S.transitions, {});
	});

	describe('#getStateForInput', function() {
		var state_B;

		beforeEach(function() {
			state_B = new State('B');
			state_S.transitions = {
				'0': state_B
			};
		});

		it('should give state form the transition', function() {
			assert.deepEqual(state_S.getStateForInput('0'), state_B);
		});
	});
});