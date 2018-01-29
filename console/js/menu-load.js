var json_pages = null;

$(document).ready(function() {
  $.ajax( "pages/pages.json?t=" + Date.now(), {"dataType": 'json', "timeout": 3000})
  .done (function( data ) {
    json_pages = data;
    parse_url();
  })
  .fail (function() {
    $("#content").hide();
    $("#spinner").hide();
    $("#content").html("<p class=\"text-center\"><strong>Failed to retrieve pages definition. Please retry later</strong></p>");
    $("#content").fadeIn();
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
      $.ajax( file["html"] + "?t=" + Date.now(), {"timeout": 3000})
        .done (function(data) {
          $( "#content" ).html(data);
          window[file["javascript"]](hash);
        })
        .fail(function() {
          $("#spinner").hide();
          $("#content").html("<p class=\"text-center\"><strong>Error while loading requested page. Please try again later</strong></p>");
          $("#content").fadeIn();
      });
    });
  }
}

function defaultpage() {
  $("#spinner").hide();
  $("#content").fadeIn(200);
}
