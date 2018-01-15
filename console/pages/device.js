function device(hash) {
  if (hash[1] == undefined) {
    $("#content").html("<div class=\"container-fluid\"><div class=\"alert alert-danger\">Invalid device request</div></div>");
    $("#content").fadeIn(200);
  } else {
    var date_input=$('input[name="date"]'); //our date input has the name "date"
var container=$('.bootstrap-iso form').length>0 ? $('.bootstrap-iso form').parent() : "body";
var options={
  format: 'mm/dd/yyyy',
  container: container,
  todayHighlight: true,
  autoclose: true,
};
date_input.datepicker(options);

    $.getJSON( "https://ttnmon.meis.space/api/packet/?dev_pseudonym=" + hash[1] + "&date_start=2018-01-01 00:00:00&date_end=2018-12-31 23:59:59", function( data ) {
      $("#SF_min").text(data["packet_stats"]["SF_min"]); //packet stats
      $("#SF_max").text(data["packet_stats"]["SF_max"]);
      $("#packets").text(data["packet_stats"]["packets"]);

      $.each(data["gateways"], function(key, gateway) {
        //alert(gateway["gtw_id"]);
        $("#gateways").append('<a class="list-group-item list-group-item-action" href="#"><div class="media"><div class="media-body"><strong>' + gateway["gtw_id"] + '</strong><br>Packets: ' + gateway["packets"] + '<br>RSSI min: ' + gateway["rssi_min"] + '<br>RSSI max: ' + gateway["rssi_max"] + '<br>SNR min: ' + gateway["snr_min"] + '<br>SNR max: ' + gateway["snr_max"] + '<div class="text-muted smaller">' + gateway["lat"] + ' | ' + gateway["lon"] + ' | ' + gateway["alt"] + 'm</div></div></div></a>')
      });

      $( "#content" ).fadeIn(200);
    });
  }
}
