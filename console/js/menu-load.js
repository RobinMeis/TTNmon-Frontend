var json_pages = null;

$(document).ready(function() {
  $.getJSON( "pages/pages.json", function( data ) {
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
      $.get( file["html"], function(data) {
        $( "#content" ).fadeOut(200, function() {
          $( "#content" ).html(data);
          window[file["javascript"]](hash);
        });
      })
      .fail(function() {
        $( "#content" ).html("Error while loading data. Please try again later");
      });
    }
}

function defaultpage() {
  $( "#content" ).fadeIn(200);
}
