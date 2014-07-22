// Websocket setup
var scheme = "ws://";
var loc = window.location, new_uri;
if (loc.protocol === "https:") {
  uri = "wss:";
} else {
  uri = "ws:";
}
uri += "//" + loc.host + loc.pathname;
var ws = new WebSocket(uri);

// Circle cursor in canvas
var circlePath = new Path.Circle(new Point(10, 10), 2.5);
circlePath.strokeColor = 'black';

function onMouseMove(event) {
  circlePath.position = event.point;
}

// The minimum distance the mouse has to drag
// before firing the next onMouseDrag event:
tool.minDistance = 1;

var path; // Set the path

// Mouse events
function onMouseDown(event) {
  startPath(event.point["x"], event.point["y"], style);
  ws.send(JSON.stringify({ message: "start", x: event.point["x"], y: event.point["y"], style: style }));
}

function onMouseDrag(event) {
  circlePath.position = event.point;
  drawPath(event.point["x"], event.point["y"]);
  ws.send(JSON.stringify({ message: "draw", x: event.point["x"], y: event.point["y"] }));
}

function onMouseUp(event) {
  // When the mouse is released, simplify the path:
  simplify();
  ws.send(JSON.stringify({ message: "simplify" }));
}


// Drawing functions
function startPath(x, y, line_style) {
  path = new Path();
  path.style = line_style;
  path.add(x, y)
}

function drawPath(x, y) {
  path.add(x, y)
}

function simplify() {
  path.simplify();
}

// Receiving socket messages
ws.onmessage = function(message) {
  var data = JSON.parse(message.data);
  if (data.message == "start") {
    startPath(data.x, data.y, data.style);
    paper.view.draw();
  } else if (data.message == "draw") {
    drawPath(data.x, data.y);
    paper.view.draw();
  } else {
    simplify();
    paper.view.draw();
  }
};