Raphael.fn.connection = function(obj1, obj2, input, line, bg) {
	input && (input.onTransition = true);

	if (obj1.line && obj1.from && obj1.to) {
		line = obj1;
		obj1 = line.from;
		obj2 = line.to;
	}

	var c1 = obj1.getBBox();
	var c2 = obj2.getBBox();

	var circleOne = [{
		x: c1.x + c1.width / 2,
		y: c1.y - 1
	}, {
		x: c1.x + c1.width / 2,
		y: c1.y + c1.height + 1
	}, {
		x: c1.x - 1,
		y: c1.y + c1.height / 2
	}, {
		x: c1.x + c1.width + 1,
		y: c1.y + c1.height / 2
	}];

	var circleTwo = [{
		x: c2.x + c2.width / 2,
		y: c2.y - 1
	}, {
		x: c2.x + c2.width / 2,
		y: c2.y + c2.height + 1
	}, {
		x: c2.x - 1,
		y: c2.y + c2.height / 2
	}, {
		x: c2.x + c2.width + 1,
		y: c2.y + c2.height / 2
	}];

	var d = {};
	var dis = [];
	var distance = 100000;

	circleOne.forEach(function(from) {
		circleTwo.forEach(function(to) {
			var dx = Math.abs(from.x - to.x);
			var dy = Math.abs(from.y - to.y);
			if (distance > (dx + dy)) {
				distance = (dx + dy);
				pointOne = from;
				pointTwo = to;
			}
		});
	});

	var res = (dis.length == 0) ? [circleOne[0], circleTwo[0]] : d[Math.min.apply(Math, dis)];

	var x1 = pointOne.x;
	var y1 = pointOne.y;
	var x4 = pointTwo.x;
	var y4 = pointTwo.y;

	var x2 = x1;
	var y2 = y1;

	if (line.line && line.line.attrs) {
		var tempPath = line.line.attrs.path;
		x2 = tempPath[1][1];
		y2 = tempPath[1][2];
	}

	dx = Math.max(Math.abs(x1 - x4) / 2, 10);
	dy = Math.max(Math.abs(y1 - y4) / 2, 10);

	var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x4, y4, x4.toFixed(3), y4.toFixed(3)].join(",");

	if (line && line.line) {
		line.bg && line.bg.attr({
			path: path
		});
		line.line.attr({
			path: path
		});
		var length = line.line.getTotalLength();
		var point = line.line.getPointAtLength(length / 2);
		dragBubbleTo(line.input, line.input.pairs[0], point.x, point.y);
	} else {
		var color = typeof line == "string" ? line : "#000";

		var bg = bg && bg.split && this.path(path).attr({
			stroke: bg.split("|")[0],
			fill: "none",
			"stroke-width": bg.split("|")[1] || 3
		});

		var myLine = this.path(path).attr({
			stroke: color,
			fill: "none",
			'stroke-width': 2,
			'arrow-end': 'classic-wide-long'
		});

		var myConnection = {
			bg: bg,
			line: myLine,
			from: obj1,
			to: obj2,
			input: input
		};

		myLine.input = input;
		input.update = function(x, y) {
			var X = this.attr("cx") + x;
			var Y = this.attr("cy") + y;
			this.attr({
				cx: X,
				cy: Y
			});

			var tempPath = myConnection.line.attrs.path;
			path = ["M", tempPath[0][1], tempPath[0][2], "C", X, Y, tempPath[1][3], tempPath[1][4], tempPath[1][5], tempPath[1][6]].join(",");
			myConnection.line.hide();
			myConnection.line.remove();
			myConnection.line = paper.path(path).attr({
				stroke: color,
				fill: "none",
				'stroke-width': 2,
				'arrow-end': 'classic-wide-long'
			});
		};
		return myConnection;
	}
};