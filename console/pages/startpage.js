function startpage() {
  $.getJSON( "https://api.ttnmon.meis.space/api/stats/")
  .done( function( data ) {
    if (data["error"] == 0) {
      $("#registered_devices").text(data["stats"]["devices"]["count"]);
      $("#authorization_tokens").text(data["stats"]["authorizations"]["count"]);
      $("#received_packets").text(data["stats"]["packets"]["count"]);
      $("#gateways").text(data["stats"]["unique_gateways"]["count"]);
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
    $( "#content" ).fadeIn(200);
    $("#registered_devices").hide();
    $("#authorization_tokens").hide();
    $("#received_packets").hide();
  });
}
