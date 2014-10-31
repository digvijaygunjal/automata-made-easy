var paper = Raphael(100, 200, "80%", "70%");

var addState = function() {
	var name = document.getElementById('state-name').value;
	if (!designer.getStateTemplateByText(name) && name) {
		designer.drawState(100, 100, name);
	}
};

var init = function() {
	paper.clear();
	var rect = paper.rect(0, 0, "100%", "100%");
	rect.attr("stroke", "#000000");
};