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

OurPath.prototype.sendMessage = function(type) {
  ws.send(JSON.stringify({type: type, path: this}));
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
ws.onmessage = function(event) {
  var message = JSON.parse(event.data);

  switch(message.type) {
    case "start":
      startPath(message.path);
      break;
    case "draw":
      drawPath(message.path);
      break;
    case "simplify":
      simplify(message.path);
      break;
    case "request":
      ws.send(JSON.stringify({ type: "redraw", paths: paths }));
      break;
    case "redraw":
      for (var path in message.paths) {
        paths[path] = new Path(message.paths[path]["1"]);
        view.draw();
      }
  }
};