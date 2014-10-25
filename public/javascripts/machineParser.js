function machineParser() {
	var getKeys = function(json) {
		return Object.keys(json);
	};

	var getStateByName = function(states, name) {
		var state = null;
		states.forEach(function(s) {
			if (s.name == name)
				state = s;
		});
		return state;
	};

	var createStates = function(json) {
		var stateNames = getKeys(json['transitions']);

		var states = stateNames.map(function(StateName) {
			return new state(StateName);
		})

		states.forEach(function(state) {
			json['inputSet'].split(',').forEach(function(input) {
				var name = json['transitions'][state.name][input];
				state.transitions[input] = getStateByName(states, name);
			});
		});

		return states;
	};

	this.createObject = function(json) {
		var states = createStates(json);
		var startState = getStateByName(states, json['start']);
		var finalStates = json['final'].split(',').map(function(name) {
			return getStateByName(states, name);
		});

		return new machine(startState, finalStates, states);
	};
}