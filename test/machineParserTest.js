var assert = chai.assert;

describe('#Parser', function() {
	var json = {
		"start": "S",
		"final": "A",
		"inputSet": "0,1",
		"transitions": {
			"S": {
				"0": "A",
				"1": "S"
			},
			"A": {
				"0": "S",
				"1": "A"
			}
		}
	};

	it('should create a machine from given json', function(){
		var dfaMachine = MachineParser.createMachine(json);

		assert.equal(dfaMachine.startState.name, "S");
		assert.equal(dfaMachine.finalStates[0].name, "A");
	});
});