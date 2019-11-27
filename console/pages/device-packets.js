function get_packets(dev_pseudonym, date_start, date_end) {
    $("#content").fadeIn(200);
    $("#spinner").hide();
    updateStatsGateways(dev_pseudonym, date_start, date_end);
    updateFrequency(dev_pseudonym, date_start, date_end)
    updateSF(dev_pseudonym, date_start, date_end)
    updatePacketCounter(dev_pseudonym, date_start, date_end)
    updateGatewayCount(dev_pseudonym, date_start, date_end)
    updatePayloadLength(dev_pseudonym, date_start, date_end)
}

function updateFrequency(pseudonym, date_start, date_end) {
  $('#frequency').attr('src', "https://grafana.ttnmon.meis.space/d-solo/FEa9sNdZk/packet-metadata?orgId=1&from=" + date_start.getTime() + "&to=" + (date_end.getTime() + 86400000) + "&var-devPseudonym=" + pseudonym + "&panelId=2");
}

function updateSF(pseudonym, date_start, date_end) {
  $('#SF').attr('src', "https://grafana.ttnmon.meis.space/d-solo/FEa9sNdZk/packet-metadata?orgId=1&from=" + date_start.getTime() + "&to=" + (date_end.getTime() + 86400000) + "&var-devPseudonym=" + pseudonym + "&panelId=8");
}

function updatePacketCounter(pseudonym, date_start, date_end) {
  $('#packetCounter').attr('src', "https://grafana.ttnmon.meis.space/d-solo/FEa9sNdZk/packet-metadata?orgId=1&from=" + date_start.getTime() + "&to=" + (date_end.getTime() + 86400000) + "&var-devPseudonym=" + pseudonym + "&panelId=4");
}

function updateGatewayCount(pseudonym, date_start, date_end) {
  $('#gatewayCount').attr('src', "https://grafana.ttnmon.meis.space/d-solo/FEa9sNdZk/packet-metadata?orgId=1&from=" + date_start.getTime() + "&to=" + (date_end.getTime() + 86400000) + "&var-devPseudonym=" + pseudonym + "&panelId=6");
}

function updatePayloadLength(pseudonym, date_start, date_end) {
  $('#payloadLength').attr('src', "https://grafana.ttnmon.meis.space/d-solo/FEa9sNdZk/packet-metadata?orgId=1&from=" + date_start.getTime() + "&to=" + (date_end.getTime() + 86400000) + "&var-devPseudonym=" + pseudonym + "&panelId=10");
}

function updateStatsGateways(pseudonym, date_start, date_end) {
  $.ajax( "https://api.ttnmon.meis.space/v2/metadata/device/" + hash[1] + "/packets/" + date_start.toISOString() + "/" + date_end.toISOString(), {"dataType": 'json', "timeout": 10000},)
    .done (function( data ) { //Get table data
      if (data["error"] == 0) {
        data = data["data"]
        $('#SF_min').text(data["SF"]["min"]);
        $('#SF_max').text(data["SF"]["max"]);
        $('#RSSI_min').text(data["RSSI"]["min"]);
        $('#RSSI_max').text(data["RSSI"]["max"]);
        $('#SNR_min').text(data["SNR"]["min"]);
        $('#SNR_max').text(data["SNR"]["max"]);
        $('#gateway_count_min').text(data["gatewayCount"]["min"]);
        $('#gateway_count_max').text(data["gatewayCount"]["max"]);
        $('#packets').text(data["packets"]);

        $("#gateways").html("");
        $.each(data["gateways"], function(gtwID, gateway) {
          var coordinates_string = "";
          if (gateway["location"]["latitude"] != null && gateway["location"]["longitude"] != null) { //Hide coordinates if null
            coordinates_string = '<div class="text-muted smaller">' + gateway["location"]["latitude"] + ' | ' + gateway["location"]["longitude"];
            if (gateway["location"]["altitude"] != null)
              coordinates_string += ' | ' + gateway["location"]["altitude"] + 'm';
            if (gateway["distance"] != null) {
              if (gateway["distance"] >= 1000) //km
                coordinates_string += ' | Distance: ' + Math.round(gateway["distance"] / 100) / 10 + ' km';
              else { //meters
                coordinates_string += ' | Distance: ' + Math.round(gateway["distance"]) + ' m';

              }
            }

            coordinates_string += '</div>'
          }

          if (gateway["description"] == null) gateway["description"] = ""; //Hide empty descriptions
          $("#gateways").append('<a class="list-group-item list-group-item-action gateway_select" id="' + gtwID + '" href="' + location.hash + '"><div class="media"><div class="media-body"><strong>' + gtwID + '</strong><br><span class="font-weight-light">' + gateway["description"] + '</span><br>Packets: ' + gateway["packets"] + '<br>RSSI min: ' + gateway["RSSI"]["min"] + '<br>RSSI max: ' + gateway["RSSI"]["max"] + '<br>SNR min: ' + gateway["SNR"]["min"] + '<br>SNR max: ' + gateway["SNR"]["max"] + coordinates_string + '</div></div></a>');
        });
        device_gateways();
      }
    }).fail(function(data) {
      alert("Failed to fetch statistic. Some data and gateway information are unavailable");
    });
}

function update_date_button() {
  var date_start = $('#date_start').datepicker("getDate");
  var date_end = $('#date_end').datepicker("getDate");
  get_packets(hash[1], date_start, date_end)
  update_hash(hash[0] + "-" + hash[1] + "-" + date_start.getDate() + "." + (date_start.getMonth() + 1) + "." + date_start.getFullYear() + "-" + date_end.getDate() + "." + (date_end.getMonth() + 1) + "." + date_end.getFullYear(), true); //Update hash with new dates
}
