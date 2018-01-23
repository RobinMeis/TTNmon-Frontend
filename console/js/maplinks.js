function getColor(value) { //https://stackoverflow.com/a/17268489
    //value from 0 to 1
    var hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}

class mapLinks {
  constructor(map) {
    this._mapContainer = map; //Initialize variables
    this._gateways = [];
    this._nodes = [];

    this.gatewayIcon = L.icon({ //Initialize icons
        iconUrl: 'img/gateway.png',
        iconSize:     [38, 60], // size of the icon
        iconAnchor:   [19, 60], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    this.nodeIcon = L.icon({
        iconUrl: 'img/node.png',
        iconSize:     [38, 60], // size of the icon
        iconAnchor:   [19, 60], // point of the icon which will correspond to marker's location
        popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });

    this._map = L.map(this._mapContainer).setView([40, 0], 3);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(this._map);
  }

  get map() {
    return this._map;
  }

  addGateway(gtw_id, latitude, longitude, popup=null) { //Add gateway to map
    if (this._gateways[gtw_id] == undefined) { //Add only new gateways
      if (popup == null) popup = gtw_id;
      this._gateways[gtw_id] = L.marker([latitude, longitude], {icon: this.gatewayIcon})
        .bindPopup(popup)
        .addTo(this._map);
      return true;
    } else
      return false;
  }

  addNode(node_pseudonym, latitude, longitude, popup=null) { //Add node to map
    if (this._nodes[node_pseudonym] == undefined) { //Add only new nodes
      if (popup == null) popup = node_pseudonym;
      this._nodes[node_pseudonym] = L.marker([latitude, longitude], {icon: this.nodeIcon})
        .bindPopup(popup)
        .addTo(this._map);
      return true;
    } else
      return false;
  }

  addLink(gtw_id, node_pseudonym, packet_loss) { //Add link between gateways and nodes to map. Packet loss in percent
    if (this._gateways[gtw_id] != undefined && this._nodes[node_pseudonym] != undefined) {
      var latlngs = []
      latlngs.push (this._gateways[gtw_id].getLatLng());
      latlngs.push (this._nodes[node_pseudonym].getLatLng());

      L.polyline(latlngs, {color: getColor(packet_loss / 100)}).addTo(this._map);
    }
  }
}
