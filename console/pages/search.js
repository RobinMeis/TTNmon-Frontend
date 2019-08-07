$(document).ready(function() {
  $("#search-button").click(search);
  $("#search-input").on('keypress', search_key_pressed);

});

function search() {
  var input = $("#search-input").val();
  if (input != "") {
    $.getJSON( "https://api.beta.ttnmon.meis.space/api/search/?query=" + input, function( result ) {
      if (result["error"] == 0) { //Show device page
        window.location.hash = "device-" + result["pseudonym"];
        $("#search-input").val("");
      } else { //Not found. Show error
        window.location.hash = "search";
        $("#content").fadeOut(200, function() {
          $("#content").html("<div class=\"container-fluid\"><div class=\"alert alert-info\">Your search query failed. " + result["msg_en"] + "</div></div>");
          $("#content").fadeIn(200);
        });
      }
    });
  }
}

function search_key_pressed(e) {
  if(e.which === 13)
    search();
}

function search_dummy() {

}
