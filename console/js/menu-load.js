$(document).ready(function() {
  parse_url();
});

window.onhashchange = function(){
  parse_url();
}

function parse_url() {

  if (window.location.hash == "" || window.location.hash == "#")
    load_page("pages/startpage.html");
  else
    load_page("pages/" +  window.location.hash.replace("#", "") + ".html");
}

function load_page(file) {
  //$( ".navbar a" ).click(function() {
    var jqxhr = $.get( file, function(data) {
      $( "#content" ).fadeOut(200, function() {
        $( "#content" ).html(data);
        $( "#content" ).fadeIn(299)

      })



    })
      .fail(function() {
        $( "#content" ).html("Error while loading data. Please try again later");

      })

  //});
}
