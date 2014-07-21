var scheme = "ws://";
var loc = window.location, new_uri;
if (loc.protocol === "https:") {
  uri = "wss:";
} else {
  uri = "ws:";
}
uri += "//" + loc.host + loc.pathname;
var ws = new WebSocket(uri);

//
var circlePath = new Path.Circle(new Point(10, 10), 2.5);
circlePath.strokeColor = 'black'

function onMouseMove(event) {
  circlePath.position = event.point;
}

// The minimum distance the mouse has to drag
// before firing the next onMouseDrag event:
tool.minDistance = 2;

var path;

function onMouseDown(event) {
  startPath(event.point["x"], event.point["y"]);
  ws.send(JSON.stringify({ message: "start", x: event.point["x"], y: event.point["y"] }));
}

function onMouseDrag(event) {
  circlePath.position = event.point;
  drawPath(event.point["x"], event.point["y"]);
  ws.send(JSON.stringify({ message: "draw", x: event.point["x"], y: event.point["y"] }));
}

function onMouseUp(event) {
  // When the mouse is released, simplify it:
  path.simplify();
}

function startPath(x, y) {
  // console.log("Drawing... X: " + x + " Y: " + y)
  path = new Path();
  path.strokeColor = '#00000';
  path.strokeWidth = 5;
  path.strokeCap = 'round';
  path.strokeJoin = 'round';
  path.add(x, y)
}

function drawPath(x, y) {
  // console.log("Drawing... X: " + x + " Y: " + y)
  path.add(x, y)
}

ws.onmessage = function(message) {
  var data = JSON.parse(message.data);
  if (data.message == "start") {
    startPath(data.x, data.y);
    paper.view.draw();
  } else {
    drawPath(data.x, data.y);
    paper.view.draw();
  }
};