function device_gateways() {
  $(".gateway_select").click(function(e) { //Gateway button click
    var gtw_id = $(this).attr('id');
    update_hash(hash[0] + "-" + hash[1] + "-" + hash[2] + "-" + hash[3] + "-" + gtw_id, true);
    load_gateway(hash[1], gtw_id, $('#date_start').datepicker("getDate"), $('#date_end').datepicker("getDate"));
  });

  $("#gtw_hide").click(function(e) { //Gateway button click
    hide_gateways();
  });
}

function load_gateway(dev_pseudonym, gtw_id, date_start, date_end) {
  $(".gtw_id").text(gtw_id);
  $("#gtw_hide").attr("href", location.hash);

  updateGatewayRSSI(dev_pseudonym, gtw_id, date_start, date_end);
  updateGatewaySNR(dev_pseudonym, gtw_id, date_start, date_end);
  updateGatewayChannel(dev_pseudonym, gtw_id, date_start, date_end);
  $(".gtw_graph").fadeIn();
}

function hide_gateways() {
  $(".gtw_graph").fadeOut();
}

function updateGatewayRSSI(pseudonym, gtwID, date_start, date_end) {
  $('#gateway_rssi').attr('src', "https://grafana.ttnmon.meis.space/d-solo/IHcq8HOZk/packet-gateway-metadata?orgId=1&from=" + date_start.getTime() + "&to=" + (date_end.getTime() + 86400000) + "&var-gtwID=" + gtwID + "&var-devPseudonym=" + pseudonym + "&panelId=2");
}

function updateGatewayChannel(pseudonym, gtwID, date_start, date_end) {
  $('#gateway_channel').attr('src', "https://grafana.ttnmon.meis.space/d-solo/IHcq8HOZk/packet-gateway-metadata?orgId=1&from=" + date_start.getTime() + "&to=" + (date_end.getTime() + 86400000) + "&var-gtwID=" + gtwID + "&var-devPseudonym=" + pseudonym + "&panelId=6");
}

function updateGatewaySNR(pseudonym, gtwID, date_start, date_end) {
  $('#gateway_snr').attr('src', "https://grafana.ttnmon.meis.space/d-solo/IHcq8HOZk/packet-gateway-metadata?orgId=1&from=" + date_start.getTime() + "&to=" + (date_end.getTime() + 86400000) + "&var-gtwID=" + gtwID + "&var-devPseudonym=" + pseudonym + "&panelId=4");
}
