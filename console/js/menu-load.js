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
  if (window.location.hash == "" || window.location.hash == "#")
    load_page(json_pages["#startpage"]);
  else
    if (json_pages[window.location.hash] != undefined)
      load_page(json_pages[window.location.hash]);
    else
      $( "#content" ).html("Sorry, file not found");
}

function load_page(file) {
    $.get( file["html"], function(data) {
      $( "#content" ).fadeOut(200, function() {
        $( "#content" ).html(data);
        window[file["javascript"]]();
      })
    })
    .fail(function() {
      $( "#content" ).html("Error while loading data. Please try again later");
    })
}

function defaultpage() {
  $( "#content" ).fadeIn(200);
}
