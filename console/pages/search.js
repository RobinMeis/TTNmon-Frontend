$(document).ready(function() {
  $("#search-button").click(search);
  $("#search-input").on('keypress', search_key_pressed);

});

function search() {
  var input = $("#search-input").val();
  if (input != "") {
    window.location.hash = "device-" + input;
  }
}

function search_key_pressed(e) {
  if(e.which === 13)
    search();
}

function search_dummy() {

}
