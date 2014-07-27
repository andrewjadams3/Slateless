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
var cursor = new Path.Circle(new Point(-10, -10), 2.5);
cursor.strokeColor = 'black';

function onMouseMove(event) {
  cursor.position = event.point;
}

// The minimum distance the mouse has to drag
// before firing the next onMouseDrag event:
tool.minDistance = 1;

//Store draw paths
var paths = {}; // Set the path
var path_id;

//Create a unique path id
var uniqid = function() {
  return Date.now();
}

// Mouse events
function onMouseDown(event) {
  path_id = uniqid();
  startPath(event.point["x"],
            event.point["y"],
            path_id,
            style
  );
  ws.send(JSON.stringify({ message: "start",
                           x: event.point["x"],
                           y: event.point["y"],
                           id: path_id,
                           style: style 
  }));
}

function onMouseDrag(event) {
  cursor.position = event.point;
  drawPath(event.point["x"], 
           event.point["y"],
           path_id
  );
  ws.send(JSON.stringify({ message: "draw", 
                           x: event.point["x"],
                           y: event.point["y"],
                           id: path_id
  }));
}

function onMouseUp(event) {
  // When the mouse is released, simplify the path:
  simplify(path_id);
  ws.send(JSON.stringify({ message: "simplify", id: path_id }));
}


// Drawing functions
function startPath(x, y, id, line_style) {
  paths[id] = new Path();
  paths[id].style = line_style;
  paths[id].add(x, y)
}

function drawPath(x, y, id) {
  paths[id].add(x, y)
}

function simplify(id) {
  paths[id].simplify();
}

// Receiving socket messages
ws.onmessage = function(message) {
  var data = JSON.parse(message.data);
  if (data.message == "start") {
    startPath(data.x, data.y, data.id, data.style);
    view.draw();
  } else if (data.message === "draw") {
    drawPath(data.x, data.y, data.id);
    view.draw();
  } else if (data.message === "simplify") {
    simplify(data.id);
    view.draw();
  } else if (data.message === "request") {
    ws.send(JSON.stringify({ message: "redraw", paths: paths }));
  } else if (data.message === "redraw") {
      for (var path in data.paths) {
        paths[path] = new Path(data.paths[path]["1"]);
        view.draw();
      }
  }
};

$(document).on('ready', function() {
  $("#black").click(function() {alert('hi!')});
});