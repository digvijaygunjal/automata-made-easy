var MachineParser = {};

// Validate and sanitize input
var sanitizeString = function(str) {
  if (typeof str !== 'string') return '';
  // Remove null bytes and control characters
  return str.replace(/[\x00-\x1F\x7F]/g, '').trim();
};

var getKeys = function(json) {
  if (!json || typeof json !== 'object') return [];
  return Object.keys(json);
};

var getStateByName = function(states, name) {
  if (!name || typeof name !== 'string') return null;
  var state = null;
  var sanitizedName = sanitizeString(name);
  states.forEach(function(s) {
    if (s.name == sanitizedName) state = s;
  });
  return state;
};

var createStates = function(json) {
  if (!json || !json.transitions || typeof json.transitions !== 'object') {
    throw new Error('Invalid transitions object');
  }
  
  var stateNames = getKeys(json.transitions);
  if (stateNames.length == 0) {
    if (!json.start || typeof json.start !== 'string') {
      throw new Error('Invalid start state');
    }
    stateNames.push(sanitizeString(json.start));
  }

  var states = stateNames.map(function(StateName) {
    var sanitizedName = sanitizeString(StateName);
    if (!sanitizedName) {
      throw new Error('Invalid state name');
    }
    return new State(sanitizedName);
  });

  if (!json.inputSet || typeof json.inputSet !== 'string') {
    throw new Error('Invalid inputSet');
  }

  states.forEach(function(state) {
    var inputArray = json.inputSet.split(',');
    inputArray.forEach(function(input) {
      var sanitizedInput = sanitizeString(input);
      if (sanitizedInput && json.transitions[state.name]) {
        var name = json.transitions[state.name][sanitizedInput];
        if (name && typeof name === 'string') {
          state.transitions[sanitizedInput] = getStateByName(states, name);
        }
      }
    });
  });

  return states;
};

MachineParser.createMachine = function(json) {
  if (!json) {
    throw new Error('JSON is required');
  }
  
  if (!json.start || typeof json.start !== 'string') {
    throw new Error('Start state is required and must be a string');
  }
  
  if (!json.final || typeof json.final !== 'string') {
    throw new Error('Final states are required');
  }

  var states = createStates(json);
  var startState = getStateByName(states, json.start);
  
  if (!startState) {
    throw new Error('Start state not found in states');
  }

  var finalStates = json.final.split(',').map(function(name) {
    return getStateByName(states, name);
  }).filter(function(state) {
    return state !== null;
  });

  if (finalStates.length === 0) {
    throw new Error('No valid final states found');
  }

  return new Machine(startState, finalStates, states);
};