function get_packets(dev_pseudonym, date_start, date_end) {
    $("#content").fadeIn(200);
    $("#spinner").hide();
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

function update_date_button() {
  var date_start = $('#date_start').datepicker("getDate");
  var date_end = $('#date_end').datepicker("getDate");
  get_packets(hash[1], date_start, date_end)
  update_hash(hash[0] + "-" + hash[1] + "-" + date_start.getDate() + "." + (date_start.getMonth() + 1) + "." + date_start.getFullYear() + "-" + date_end.getDate() + "." + (date_end.getMonth() + 1) + "." + date_end.getFullYear(), true); //Update hash with new dates
}
