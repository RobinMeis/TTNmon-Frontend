function map_page() { //Runs on each page load
  mapping = new mapLinks("map");
  //mapping.addGateway("test-gtw", 42.78446,-86.11166)
  //mapping.addNode("test-node", 20,86.11166)
  //mapping.addLink("test-gtw", "test-node", 75);
  $.getJSON( "https://api.ttnmon.meis.space/api/gateway/list/", function( data ) { //Add gateways to map
    $.each( data["gateways"], function( key, gateway ) {
      if (gateway["latitude"] != null && gateway["longitude"] != null)
        mapping.addGateway(gateway["gtw_id"], gateway["latitude"], gateway["longitude"], "<strong>" + gateway["gtw_id"] + "</strong><br>First seen: " + gateway["first_seen"] + "<br>Last seen: " + gateway["last_seen"] + "<br>Channels: " + gateway["channels"] + "<br>Packets: " + gateway["packets"]);
    });
  });

  $.getJSON( "https://api.ttnmon.meis.space/api/device/locations/", function( data ) { //Add nodes to map
    $.each( data["devices"], function( key, node ) {
      if (node["latitude"] != null && node["longitude"] != null)
        mapping.addNode(node["pseudonym"], node["latitude"], node["longitude"], "<br>First seen: " + node["created"] + "<br>Last seen: " + node["last_seen"] + "<br><strong><a href=\"#device-" + node["pseudonym"] + "\">Details</strong>");
    });
  });

  $("#content").fadeIn(200, function() {
    mapping.map.invalidateSize();
  });
}
