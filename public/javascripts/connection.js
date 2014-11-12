Raphael.fn.connection = function(obj1, obj2, input, line, bg) {
    input && (input.onTransition = true);

    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }

    var bb1 = obj1.getBBox();
    var bb2 = obj2.getBBox();

    var p1 = [{
        x: bb1.x + bb1.width / 2,
        y: bb1.y - 1
    }, {
        x: bb1.x + bb1.width / 2,
        y: bb1.y + bb1.height + 1
    }, {
        x: bb1.x - 1,
        y: bb1.y + bb1.height / 2
    }, {
        x: bb1.x + bb1.width + 1,
        y: bb1.y + bb1.height / 2
    }];

    var p2 = [{
        x: bb2.x + bb2.width / 2,
        y: bb2.y - 1
    }, {
        x: bb2.x + bb2.width / 2,
        y: bb2.y + bb2.height + 1
    }, {
        x: bb2.x - 1,
        y: bb2.y + bb2.height / 2
    }, {
        x: bb2.x + bb2.width + 1,
        y: bb2.y + bb2.height / 2
    }];

    var d = {};
    var dis = [];

    p1.forEach(function(from) {
        p2.forEach(function(to) {
            var dx = Math.abs(from.x - to.x);
            var dy = Math.abs(from.y - to.y);
            dis.push(dx + dy);
            d[dis[dis.length - 1]] = [from, to];            
        });
    });

    var res = (dis.length == 0) ? [p1[0], p2[0]] : d[Math.min.apply(Math, dis)];

    var x1 = res[0].x;
    var y1 = res[0].y;
    var x4 = res[1].x;
    var y4 = res[1].y;

    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);

    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x1, y1, x4, y4, x4.toFixed(3), y4.toFixed(3)].join(",");

    if (line && line.line) {
        line.bg && line.bg.attr({
            path: path
        });
        line.line.attr({
            path: path
        });
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