var assert = chai.assert;

describe('#Designer', function() {
	paper = {};
	var circle;
	var text;

	describe('addInput', function() {

		beforeEach(function() {
			paper.circle = {
				ox: 0,
				oy: 0
			};
			paper.text = {};
		});

		it('it should add given input in input set', function() {
			designer.addInput("0");
			assert.deepEqual(["0"], designer.inputSet);
		});

		// it('it should add input bubble to every state', function() {
		// 	var state = {
		// 		circle: paper.circle,
		// 		text: paper.text,
		// 		inputBubbles: []
		// 	};
		// 	designer.states = [state];

		// 	designer.addInput("0");
		// 	assert.deepEqual(state.inputBubbles.length, 0);
		// });
	});
});