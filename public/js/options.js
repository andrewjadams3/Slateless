// Stroke style
var style = {
  strokeColor: '#000000',
  strokeWidth: 5,
  strokeCap: 'round',
  strokeJoin: 'round'
}

$(document).on('ready', function() {
  // Colors
  $("#black").click(function(event) {selectColor(event, '#colorsModal', '#000000')});
  $("#red").click(function(event) {selectColor(event, '#colorsModal', '#FF0000')});
  $("#green").click(function(event) {selectColor(event, '#colorsModal', '#009900')});
  $("#blue").click(function(event) {selectColor(event, '#colorsModal', '#000099')});
  $("#yellow").click(function(event) {selectColor(event, '#colorsModal', '#FFFF00')});
  $("#orange").click(function(event) {selectColor(event, '#colorsModal', '#FF9900')});
  $("#brown").click(function(event) {selectColor(event, '#colorsModal', '#802A2A')});
  $("#purple").click(function(event) {selectColor(event, '#colorsModal', '#663399')});
  $("#eraser").click(function(event) {selectColor(event, '#colorsModal', '#FFFFFF')});

  // Width
  $("#small").click(function(event) {selectWidth(event, '#sizesModal', 2)});
  $("#medium").click(function(event) {selectWidth(event, '#sizesModal', 5)});
  $("#large").click(function(event) {selectWidth(event, '#sizesModal', 10)});

  //Undo
  $("#undo").click(function() { DrawGlobals.undo(); });

  //Clear
  $("#cancel-reset").click(function(event) { event.preventDefault(); $('#resetModal').foundation('reveal', 'close'); });
  $("#accept-reset").click(function(event) { resetBoard(event, '#resetModal') });

  //Save
  $("#save-button").click(function(event) { event.preventDefault(); $('#saveModal').foundation('reveal', 'close'); });

  //Welcome
  $("#welcome-button").click(function(event) { event.preventDefault(); $('#welcomeModal').foundation('reveal', 'close'); });
});

function selectColor(event, modalId, color) {
  event.preventDefault();
  style.strokeColor = color
  $(modalId).foundation('reveal', 'close');
};

function selectWidth(event, modalId, width) {
  event.preventDefault();
  style.strokeWidth = width
  $(modalId).foundation('reveal', 'close');
};

function resetBoard(event, modalId) {
  event.preventDefault();
  DrawGlobals.clearScreen();
  $(modalId).foundation('reveal', 'close');
}