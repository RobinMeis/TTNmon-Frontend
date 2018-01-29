var json_pages = null;

$(document).ready(function() {
  $.getJSON( "pages/pages.json?t=" + Date.now(), function( data ) {
    json_pages = data;
    parse_url();
  });
});

window.onhashchange = function(){
  parse_url();
}

function parse_url() {
  if (window.location.hash == "") //Set hash if not set yet
    window.location.hash = "#";

  hash = window.location.hash.split("-");
  if (hash[0] == "")
    load_page(json_pages["#startpage"], hash);
  else
    if (json_pages[hash[0]] != undefined)
      load_page(json_pages[hash[0]], hash);
    else
      $( "#content" ).html("Sorry, file not found");
}

function load_page(file, hash) {
  if (file["html"] != "null") {
    $( "#content" ).fadeOut(200, function() {
      $("#spinner").show();
      $.get( file["html"] + "?t=" + Date.now(), function(data) {
          $( "#content" ).html(data);
          window[file["javascript"]](hash);
      })
      .fail(function() {
        $( "#content" ).html("<p class=\"text-center\"><strong>Error while loading data. Please try again later</strong></p>");
        $( "#content").fadeIn();
      });
    });
  }
}

function defaultpage() {
  $("#spinner").hide();
  $("#content").fadeIn(200);
}
