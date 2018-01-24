function map_page() { //Runs on each page load
  mapping = new mapLinks("map");
  var map_data = new map_page_class(mapping);

  $("#content").fadeIn(200, function() {
    mapping.map.invalidateSize();
  });
}

class map_page_class {
  constructor(mapping) {
    this.mapping = mapping;
    this.getGateways(this);
    this.getNodes(this);

    this.gateways_finished = false;
    this.nodes_finished = false;
  }

  getGateways(self) {
    $.getJSON( "https://api.ttnmon.meis.space/api/gateway/list/", function( data ) { //Add gateways to map
      var popup_string;
      $.each( data["gateways"], function( key, gateway ) {
        if (gateway["latitude"] != null && gateway["longitude"] != null) {
          popup_string = "<strong>" + gateway["gtw_id"] + "</strong><br>First seen: " + gateway["first_seen"] + "<br>Last seen: " + gateway["last_seen"] + "<br>Channels: " + gateway["channels"] + "<br>Packets: " + gateway["packets"] + "<br><small>" + gateway["latitude"] + " | " + gateway["longitude"];
          if (gateway["altitude"] == null) popup_string += "</small>"
          else popup_string += " | " + gateway["altitude"] + "m</small>"
          self.mapping.addGateway(gateway["gtw_id"], gateway["latitude"], gateway["longitude"], popup_string);
        }
      });
      self.gateways_finished = true;
      self.getLinks(self);
    });
  }

  getNodes(self) {
    $.getJSON( "https://api.ttnmon.meis.space/api/device/locations/", function( data ) { //Add nodes to map
      var popup_string;
      $.each( data["devices"], function( key, node ) {
        if (node["latitude"] != null && node["longitude"] != null) {
          popup_string = "<br>First seen: " + node["created"] + "<br>Last seen: " + node["last_seen"] + "<br><a href=\"#device-" + node["pseudonym"] + "\"><strong>Details</strong></a><br><small>" + node["latitude"] + " | " + node["longitude"];
          if (node["altitude"] == null) popup_string += "</small>"
          else popup_string += " | " + node["altitude"] + "m</small>"
          self.mapping.addNode(node["pseudonym"], node["latitude"], node["longitude"], popup_string);
        }
      });
      self.nodes_finished = true;
      self.getLinks(self);
    });
  }

  getLinks(self) {
    if (self.gateways_finished && self.nodes_finished) {
      $.getJSON( "https://api.ttnmon.meis.space/api/links/", function( data ) { //Add nodes to map
        $.each( data["links"], function( key, link ) {
          mapping.addLink(link["gtw_id"], link["dev_pseudonym"], link["snr"]);
        });
      });
    }
  }
}
