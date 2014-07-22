// Stroke style
var style = {
  strokeColor: '#000000',
  strokeWidth: 5,
  strokeCap: 'round',
  strokeJoin: 'round'
}

$(document).on('ready', function() {
  $("#black").click(function() {style.strokeColor = '#000000'});
  $("#red").click(function() {style.strokeColor = '#FF0000'});
  $("#green").click(function() {style.strokeColor = '#009900'});
  $("#blue").click(function() {style.strokeColor = '#000099'});
  $("#yellow").click(function() {style.strokeColor = '#FFFF00'});
  $("#orange").click(function() {style.strokeColor = '#FF9900'});
  $("#brown").click(function() {style.strokeColor = '#802A2A'});
  $("#purple").click(function() {style.strokeColor = '#663399'});
});