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

// Tool
tool.minDistance = 1;

// Cursor
var cursor = new Path.Circle(new Point(-10, -10), 2.5);
cursor.strokeColor = 'black';

// Paths
var paths = {};
var currentPath;

function OurPath(event) {
  this.id = Date.now();
  this.style = style;
  this.x = event.point.x;
  this.y = event.point.y;
}

OurPath.prototype.updatePoint = function(event) {
  this.x = event.point.x;
  this.y = event.point.y;
}

OurPath.prototype.sendMessage = function(message) {
  ws.send(JSON.stringify({message: message, path: this}));
};

// Mouse events
function onMouseMove(event) {
  cursor.position = event.point;
}

function onMouseDown(event) {
  currentPath = new OurPath(event);
  currentPath.sendMessage("start");
  startPath(currentPath);
}

function onMouseDrag(event) {
  cursor.position = event.point;
  currentPath.updatePoint(event);
  currentPath.sendMessage("draw");
  drawPath(currentPath);
}

function onMouseUp() {
  simplify(currentPath);
  currentPath.sendMessage("simplify");
}

// Drawing functions
function startPath(path) {
  paths[path.id] = new Path(new Point(path.x, path.y));
  paths[path.id].style = path.style;
  view.draw();
}

function drawPath(path) {
  paths[path.id].add(path.x, path.y);
  view.draw();
}

function simplify(path) {
  paths[path.id].simplify();
  view.draw();
}

// Receiving socket messages
ws.onmessage = function(message) {
  var data = JSON.parse(message.data);
  if (data.message == "start") {
    startPath(data.path);
  } else if (data.message === "draw") {
    drawPath(data.path);
  } else if (data.message === "simplify") {
    simplify(data.path);
  } else if (data.message === "request") {
    ws.send(JSON.stringify({ message: "redraw", paths: paths }));
  } else if (data.message === "redraw") {
      for (var path in data.paths) {
        paths[path] = new Path(data.paths[path]["1"]);
        view.draw();
      }
  }
};