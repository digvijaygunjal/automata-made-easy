var State = function (name) {
  this.name = name;
  this.transitions = {};

  this.getStateForInput = function(input) {
    return this.transitions[input];
  };
};