// Websocket setup
function newSocket() {
  var uri;
  var scheme = "ws://";
  var loc = window.location, new_uri;
  if (loc.protocol === "https:") {
    uri = "wss:";
  } else {
    uri = "ws:";
  };
  uri += "//" + loc.host + loc.pathname;
  return (new WebSocket(uri));
}

// Tool
tool.minDistance = 1;

// Path Attributes
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

PathAttributes.prototype.sendMessage = function(type, socket) {
  socket.send(JSON.stringify({type: type, path: this}));
};

var DrawApp = {
  paths: {},
  path_order: [],
  currentPathAttrs: null,
  cursor: new Path.Circle(new Point(-10, -10), 2.5),
  ws: newSocket()
};

DrawApp.cursor.strokeColor = 'black';

// Drawing functions
DrawApp.startPath = function(attr) {
  this.paths[attr.id] = new Path(new Point(attr.x, attr.y));
  this.paths[attr.id].style = attr.style;
  view.draw();
};

DrawApp.drawPath = function(attr) {
  this.paths[attr.id].add(attr.x, attr.y);
  view.draw();
};

DrawApp.simplify = function(attr) {
  this.paths[attr.id].simplify();
  this.path_order.push(attr.id);
  view.draw();
};

DrawApp.request = function() {
  this.ws.send(JSON.stringify({ type: "redraw", path: DrawApp.paths }));
};

DrawApp.redraw = function(path_array) {
  for (var id in path_array) {
    DrawApp.paths[id] = new Path(path_array[id]["1"]);
    DrawApp.path_order.push(id);
    view.draw();
  }
  console.log(DrawApp.path_order)
};

DrawApp.undo = function() {
  last_drawn = this.path_order.pop();
  console.log(last_drawn)
  this.paths[last_drawn].remove();
  delete this.paths[last_drawn];
  view.draw();
};

DrawApp.clearScreen = function() {
  this.path_order.forEach(function(path) {
    DrawApp.paths[path].remove();
  });
  this.paths = {}
  this.path_order = [];
  view.draw();
}

// Mouse events
function onMouseMove(event) {
  DrawApp.cursor.position = event.point;
}

function onMouseDown(event) {
  DrawApp.currentPathAttrs = new PathAttributes(event.point);
  DrawApp.currentPathAttrs.sendMessage("startPath", DrawApp.ws);
  DrawApp.startPath(DrawApp.currentPathAttrs);
}

function onMouseDrag(event) {
  DrawApp.cursor.position = event.point;
  DrawApp.currentPathAttrs.updatePoint(event.point);
  DrawApp.currentPathAttrs.sendMessage("drawPath", DrawApp.ws);
  DrawApp.drawPath(DrawApp.currentPathAttrs);
}

function onMouseUp() {
  DrawApp.simplify(DrawApp.currentPathAttrs);
  DrawApp.currentPathAttrs.sendMessage("simplify", DrawApp.ws);
}

// Receiving socket messages
DrawApp.ws.onmessage = function(event) {
  var message = JSON.parse(event.data);
  DrawApp[message.type](message.path);
};

// Globals
window.DrawGlobals = {};

DrawGlobals.clearScreen = function() {
  if (DrawApp.path_order.length > 0) {
    DrawApp.clearScreen();
    DrawApp.ws.send(JSON.stringify({ type: "clearScreen", path: null }));
  }
}

DrawGlobals.undo = function() {
  if (DrawApp.path_order.length > 0) {
    DrawApp.undo();
    DrawApp.ws.send(JSON.stringify({ type: "undo", path: null }));
  }
}