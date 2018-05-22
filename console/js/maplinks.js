function getColor(value) { //https://stackoverflow.com/a/17268489
    //value from 0 to 1
    var hue=((value)*120).toString(10);
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

    this._map = L.map(this._mapContainer, {fullscreenControl: true}).setView([40, 0], 3);
    L.Control.measureControl().addTo(this._map);
    this._osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'}).addTo(this._map);
    this._otmLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {attribution: '&copy; <a href="https://opentopomap.org/credits">OpenTopoMap</a> contributors'});
    this._tonerLiteLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> | Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});

    this._nodeLayer = L.layerGroup();
    this._gatewayLayer = L.layerGroup();
    this._linkLayer = L.layerGroup();
  }

  get map() {
    return this._map;
  }

  useTonerLite() {
    this._map.setMaxZoom(18);
    this._tonerLiteLayer.addTo(this._map);
    this._otmLayer.removeFrom(this._map);
    this._osmLayer.removeFrom(this._map);
  }

  useOSM() {
    this._map.setMaxZoom(18);
    this._osmLayer.addTo(this._map);
    this._otmLayer.removeFrom(this._map);
    this._tonerLiteLayer.removeFrom(this._map);
  }

  useOTM() {
    if (this._map.getZoom() > 17) this._map.setZoom(17); //Zoom out if zoom is to high for OTM
    this._map.setMaxZoom(17);
    this._otmLayer.addTo(this._map);
    this._osmLayer.removeFrom(this._map);
    this._tonerLiteLayer.removeFrom(this._map);
  }

  showGateways(show) {
    if (show) this._gatewayLayer.addTo(this._map);
    else this._gatewayLayer.removeFrom(this._map);
  }

  showNodes(show) {
    if (show) this._nodeLayer.addTo(this._map);
    else this._nodeLayer.removeFrom(this._map);
  }

  showLinks(show) {
    if (show) this._linkLayer.addTo(this._map);
    else this._linkLayer.removeFrom(this._map);
  }

  addGateway(gtw_id, latitude, longitude, popup=null) { //Add gateway to map
    if (this._gateways[gtw_id] == undefined && latitude != 10 && longitude != 20) { //Add only new gateways and gateways with correct position
      if (popup == null) popup = gtw_id;
      this._gateways[gtw_id] = L.marker([latitude, longitude], {icon: this.gatewayIcon})
        .bindPopup(popup)
        .addTo(this._gatewayLayer);
      return true;
    } else
      return false;
  }

  addNode(node_pseudonym, latitude, longitude, popup=null) { //Add node to map
    if (this._nodes[node_pseudonym] == undefined) { //Add only new nodes
      if (popup == null) popup = node_pseudonym;
      this._nodes[node_pseudonym] = L.marker([latitude, longitude], {icon: this.nodeIcon})
        .bindPopup(popup)
        .addTo(this._nodeLayer);
      return true;
    } else
      return false;
  }

  addLink(gtw_id, gtw_lat, gtw_lon, node_pseudonym, node_lat, node_lon, snr) { //Add link between gateways and nodes to map
    if (this._gateways[gtw_id] != undefined && this._nodes[node_pseudonym] != undefined) {
      var latlngs = []
      var gtw_latlng = this._gateways[gtw_id].getLatLng();
      var node_latlng = this._nodes[node_pseudonym].getLatLng();

      //if (gtw_latlng.lat == gtw_lat && gtw_latlng.lon == gtw_lon && node_latlng.lat == node_lat && node.node_latlng.lon == node_lon) {
      if (gtw_latlng.lat == gtw_lat && gtw_latlng.lng == gtw_lon && node_latlng.lat == node_lat && node_latlng.lng == node_lon) {
        var min_snr = -20;
        var max_snr = 20;
        var percentage;

        if (snr <= min_snr) percentage = 0; //Calculate percentage based on SNR_min and max
        else if (snr >= max_snr) percentage = 1;
        else {
          snr -= min_snr;
          max_snr -= min_snr;
          percentage = 1 - (((100 / max_snr) * snr) / 100);
        }

        latlngs.push (gtw_latlng);
        latlngs.push (node_latlng);

        L.polyline(latlngs, {color: getColor(percentage)}).addTo(this._linkLayer);
      } else {
        console.log("moved node " + node_pseudonym)
      }
    }
  }
}
