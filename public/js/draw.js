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
var path_order = [];
var currentPath;

function PathAttributes(point) {
  this.id = Date.now();
  this.style = style;
  this.x = point.x;
  this.y = point.y;
}

PathAttributes.prototype.updatePoint = function(point) {
  this.x = point.x;
  this.y = point.y;
}

PathAttributes.prototype.sendMessage = function(type) {
  ws.send(JSON.stringify({type: type, path: this}));
};

// Mouse events
function onMouseMove(event) {
  cursor.position = event.point;
}

function onMouseDown(event) {
  currentPath = new PathAttributes(event.point);
  currentPath.sendMessage("start");
  startPath(currentPath);
}

function onMouseDrag(event) {
  cursor.position = event.point;
  currentPath.updatePoint(event.point);
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
  path_order.push(path.id);
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

window.DrawGlobals = {};
DrawGlobals.clearScreen = function() {
  project.clear()
  view.draw();
}

DrawGlobals.undo = function() {
  if (path_order.length > 0) {
    last_drawn = path_order.pop();
    paths[last_drawn].remove();
    delete paths[last_drawn]
    view.draw();
  }
}