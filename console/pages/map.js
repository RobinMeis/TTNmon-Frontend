function map_page(node) { //Runs on each page load
  if (node[1] == undefined) node = null
  else node = node[1]
  mapping = new mapLinks("map");
  var map_data = new map_page_class(mapping, node);

  $('#map_selector input[type=radio]').change(function() { //Select maps
    if (this.id == "openstreetmap") mapping.useOSM();
    else if (this.id == "opentopomap") mapping.useOTM();
    else if (this.id == "toner-lite") mapping.useTonerLite();
  });

   $('#layer_selector input[type=checkbox]').change(function() { //Select maps
     var layer = $(this).attr("data-layer");
     if (layer == "nodes") {
       if ($(this).prop('checked')) mapping.showNodes(true);
       else mapping.showNodes(false);
     } else if (layer == "gateways") {
       if ($(this).prop('checked')) mapping.showGateways(true);
       else mapping.showGateways(false);
     } else if (layer == "links") {
       if ($(this).prop('checked')) mapping.showLinks(true);
       else mapping.showLinks(false);
     }
   });

  $("#spinner").hide();
  $("#content").fadeIn(200, function() {
    mapping.map.invalidateSize();
  });
}

class map_page_class {
  constructor(mapping, node=null) {
    this.mapping = mapping;
    this.node = node;
    this.gateways_finished = false;
    this.nodes_finished = false;

    if (node == null) $(".breadcrumb").append('<li class="breadcrumb-item">Map</li>'); //Generate breadcrumb
    else {
      $(".breadcrumb").append('<li class="breadcrumb-item"><a href="#map">Map</a></li><li class="breadcrumb-item active">Node ' + node + '</li>');
      $("#show_node a").attr('href', '#device-' + node);
      $("#show_node").show();
    }

    this.getGateways(this);
    this.getNodes(this);
  }

  getGateways(self) {
    $.ajax( "https://api.ttnmon.meis.space/api/gateway/list/?hide_offline=true", {"dataType": 'json', "timeout": 3000})
    .done (function( data ) { //Add gateways to map
      var popup_string;
      $.each( data["gateways"], function( key, gateway ) {
        if (gateway["latitude"] != null && gateway["longitude"] != null) {
          if (gateway["description"] == null) gateway["description"] = ""; //Hide empty descriptions
          popup_string = "<strong>" + gateway["gtw_id"] + "</strong><br><i>" + gateway["description"] + "</i><br>First seen: " + gateway["first_seen"] + "<br>Last seen: " + gateway["last_seen"] + "<br>Packets: " + gateway["packets"] + "<br><small>" + gateway["latitude"] + " | " + gateway["longitude"];
          if (gateway["altitude"] == null) popup_string += "</small>"
          else popup_string += " | " + gateway["altitude"] + "m</small>"
          self.mapping.addGateway(gateway["gtw_id"], gateway["latitude"], gateway["longitude"], popup_string);
        }
      });
      self.gateways_finished = true;
      self.mapping.showGateways(true);
      self.getLinks(self);
    })
    .fail (function() {
      $("#btn_gateways").removeClass('active');
      $("#btn_gateways input").prop("disabled", true);
      $("#btn_links").removeClass('active');
      $("#btn_links input").prop("disabled", true);
      $("#error_boxes").append($('<div class="alert alert-danger">Failed to load gateways. Gateways and links are missing on map. Please retry later</div>').hide().fadeIn(200));
    })
  }

  getNodes(self) {
    $.ajax( "https://api.ttnmon.meis.space/api/device/locations/", {"dataType": 'json', "timeout": 3000})
    .done (function( data ) { //Add nodes to map
      var popup_string;
      var found_node = false;
      $.each( data["devices"], function( key, node ) {
        if (node["latitude"] != null && node["longitude"] != null && (self.node == null || self.node == node["pseudonym"])) {
          popup_string = "<br>First seen: " + node["created"] + "<br>Last seen: " + node["last_seen"] + "<br>";
          if (self.node == null) //Hide "show only this node" if only a sigle node is shown
            popup_string += "<a href=\"#map-" + node["pseudonym"] + "\"><strong>Hide other nodes</strong></a> | ";
          popup_string += "<a href=\"#device-" + node["pseudonym"] + "\"><strong>Details</strong></a><br><small>" + node["latitude"] + " | " + node["longitude"];
          if (node["altitude"] == null) popup_string += "</small>"
          else popup_string += " | " + node["altitude"] + "m</small>"
          self.mapping.addNode(node["pseudonym"], node["latitude"], node["longitude"], popup_string);

          if (self.node != null) {
            self.mapping.map.setView([node["latitude"], node["longitude"]], 18); //Set view to node
            found_node = true;
          }
        }
      });

      if (self.node != null && found_node == false) {
        $("#error_boxes").append($('<div class="alert alert-danger">Due to missing device coordinates or wrong device id your device was not found. Please add coordinates in the TTN console to show your node on the map.</div>').hide().fadeIn(200));
        $("#spinner").hide();
        $("#map_error").fadeIn();
      }
      self.mapping.showNodes(true);
      self.nodes_finished = true;
      self.getLinks(self);
    })
    .fail (function() {
      $("#btn_nodes").removeClass('active');
      $("#btn_nodes input").prop("disabled", true);
      $("#btn_links").removeClass('active');
      $("#btn_links input").prop("disabled", true);
      $("#error_boxes").append($('<div class="alert alert-danger">Failed to load nodes. Nodes and links are missing on map. Please retry later</div>').hide().fadeIn(200));
    });
  }

  getLinks(self) {
    if (self.gateways_finished && self.nodes_finished) {
      $.ajax( "https://api.ttnmon.meis.space/api/links/", {"dataType": 'json', "timeout": 3000})
      .done (function( data ) { //Add nodes to map
        $.each( data["links"], function( key, link ) {
          if (link["distance"] != null && link["distance"] < 400000) {
            mapping.addLink(link["gtw_id"], link["coordinates"]["gateway"]["lat"], link["coordinates"]["gateway"]["lon"], link["dev_pseudonym"], link["coordinates"]["node"]["lat"], link["coordinates"]["node"]["lon"], link["snr"]);
          }
        });
      })
      .fail (function() {
        $("#btn_links").removeClass('active');
        $("#btn_links input").prop("disabled", true);
        $("#error_boxes").append($('<div class="alert alert-danger">Failed to load links between gateways and nodes. They are missing on map. Please retry later</div>').hide().fadeIn(200));
      });
      self.mapping.showLinks(true);
    }
  }
}
