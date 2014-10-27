var dfaMachine = null;

var drawDfa = function() {
	var textJson = document.getElementById('text-box').value;
	dfaMachine = MachineParser.createMachine(JSON.parse(textJson));
};

var checkInput = function(){
	var input = document.getElementById('input-box').value;
	console.log(dfaMachine.isInputAccepted(input));
};