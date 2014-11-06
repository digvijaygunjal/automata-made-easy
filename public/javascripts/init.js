var paper = Raphael(450, 300, "62%", "59%");

var addState = function(text) {
	var name = text || document.getElementById('state-name').value;
	if (!designer.getStateTemplateByText(name) && name) {
		designer.drawState(100, 100, name);
	}
};

var init = function() {
	paper.clear();
	var rect = paper.rect(0, 0, "100%", "100%");
	rect.attr("stroke", "#000000");
	rect.attr("fill", "#eee");
};