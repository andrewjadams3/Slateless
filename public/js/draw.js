var scheme   = "ws://";
var loc = window.location, new_uri;
if (loc.protocol === "https:") {
    uri = "wss:";
} else {
    uri = "ws:";
}
uri += "//" + loc.host + loc.pathname;
var ws       = new WebSocket(uri);

console.log(uri);
// The minimum distance the mouse has to drag
// before firing the next onMouseDrag event:
tool.minDistance = 1;

var path;

function onMouseDown(event) {
  startPath(event.point["x"], event.point["y"]);
  ws.send(JSON.stringify({ message: "start", x: event.point["x"], y: event.point["y"] }));
}

function onMouseDrag(event) {
  drawPath(event.point["x"], event.point["y"]);
  ws.send(JSON.stringify({ message: "draw", x: event.point["x"], y: event.point["y"] }));
}

function startPath(x, y) {
  // console.log("Drawing... X: " + x + " Y: " + y)
  path = new Path();
  path.strokeColor = '#00000';
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