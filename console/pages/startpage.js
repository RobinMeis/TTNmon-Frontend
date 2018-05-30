function startpage() {
  $.ajax( "https://api.ttnmon.meis.space/api/stats/", {"dataType": 'json', "timeout": 3000})
  .done( function( data ) {
    if (data["error"] == 0) {
      $("#registered_devices").text(data["stats"]["devices"]["count"]);
      $("#authorization_tokens").text(data["stats"]["authorizations"]["count"]);
      $("#received_packets").text(commafy(data["stats"]["packets"]["count"]));
      $("#gateways_count").text(data["stats"]["unique_gateways"]["count"]);
    } else {
      $("#registered_devices").hide();
      $("#authorization_tokens").hide();
      $("#received_packets").hide();
      $("#gateways").hide();
    }
    $( "#spinner" ).hide();
    $( "#content" ).fadeIn(200);
  })
  .fail( function() {
    $("#spinner").hide();
    $("#content").fadeIn(200);
    $("#icon_cards").hide();
  });

  getBlog();
}

function getBlog() {
  $.getJSON( "https://robin.meis.space/wp-json/wp/v2/posts/?categories=267", function( data ) {
  var articles = "";
  $.each( data, function( key, article ) {
    date = new Date( article["date_gmt"]);
    date_string = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth()+1)).slice(-2) + '.' + date.getFullYear();
    articles += '<div class="card mb-3"><div class="card-header">' + article["title"]["rendered"] + '</div><div class="card-body">' + article["content"]["rendered"] + '</div><div class="card-footer small text-muted">' + date_string + '</div></div>';
  });

  $("#blog").html(articles);
});
}

function commafy( num ) { //https://stackoverflow.com/questions/6784894/add-commas-or-spaces-to-group-every-three-digits
    var str = num.toString().split('.');
    if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1.');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
}
