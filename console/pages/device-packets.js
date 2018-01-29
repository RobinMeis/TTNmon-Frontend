function get_packets(dev_pseudonym, date_start, date_end) {
  date_end.setHours(23);
  date_end.setMinutes(59);
  date_end.setSeconds(59);
  var string_start = date_start.getFullYear() + "-" + (date_start.getMonth() + 1) + "-" + date_start.getDate();
  var string_end = date_end.getFullYear() + "-" + (date_end.getMonth() + 1) + "-" + date_end.getDate() + " " + date_end.getHours() + ":" + date_end.getMinutes() + ":" + date_end.getSeconds();
  $.ajax( "https://api.ttnmon.meis.space/api/packet/?dev_pseudonym=" + dev_pseudonym + "&date_start=" + string_start + "&date_end=" + string_end, {"dataType": 'json', "timeout": 3000})
  .done( function( data ) {
    if (data["error"] != 0) {
      $("#content").html("<div class=\"container-fluid\"><div class=\"alert alert-danger\">" + data["msg_en"] + "</div></div>");
    } else {
      $("#update_date").hide();
      $("#SF_min").text(data["packet_stats"]["SF_min"]); //packet stats
      $("#SF_max").text(data["packet_stats"]["SF_max"]);
      $("#packets").text(data["packet_stats"]["packets"]);
      $("#gateway_count_min").text(data["packet_stats"]["gateway_count_min"]);
      $("#gateway_count_max").text(data["packet_stats"]["gateway_count_max"]);

      $("#gateways").html("");
      $.each(data["gateways"], function(key, gateway) {
        var coordinates_string = "";
        if (gateway["lat"] != null || gateway["lon"] != null) { //Hide coordinates if null
          coordinates_string = '<div class="text-muted smaller">' + gateway["lat"] + ' | ' + gateway["lon"];
          if (gateway["alt"] != null)
            coordinates_string += ' | ' + gateway["alt"] + 'm';
          coordinates_string += '</div>'
        }

        $("#gateways").append('<a class="list-group-item list-group-item-action gateway_select" id="' + gateway["gtw_id"] + '" href="' + location.hash + '"><div class="media"><div class="media-body"><strong>' + gateway["gtw_id"] + '</strong><br>Packets: ' + gateway["packets"] + '<br>RSSI min: ' + gateway["rssi_min"] + '<br>RSSI max: ' + gateway["rssi_max"] + '<br>SNR min: ' + gateway["snr_min"] + '<br>SNR max: ' + gateway["snr_max"] + coordinates_string + '</div></div></a>');
      });

      spreading_factor = []; //Prepare graphs
    	frequency = [];
      packet_count = [];
    	gateway_count = [];
    	$.each(data["packets"], function (index, packet) {
    		date = Date.parse(packet["time"])
    		spreading_factor.push([date, packet["SF"]]);
    		frequency.push([date, packet["frequency"]]);
        packet_count.push([date, packet["packet_count"]]);
    		gateway_count.push([date, packet["gateway_count"]]);
    	});

      graph_frequency(frequency); //Generate graphs
      graph_spreading_factor(spreading_factor);
      graph_packet_count(packet_count);
      graph_gateway_count(gateway_count);
      device_gateways(); //Initialize gateway functions
    }
    $("#spinner").hide();
    $("#content").fadeIn(200);
  })
  .fail( function() {
    $("#spinner").hide();
    $("#content").html("<div class=\"container-fluid\"><div class=\"alert alert-danger\">Connection error. Please try again later</div></div>");
    $("#content").fadeIn(200);
  });
}

function update_date_button() {
  $( "#content" ).fadeOut(200);
  $( ".gtw_graph" ).fadeOut(200);
  $("#update_date").hide();
  get_packets(hash[1], $('#date_start').datepicker("getDate"), $('#date_end').datepicker("getDate"), false);
}

function graph_frequency(data) {
  Highcharts.chart('chart_frequency', {
      chart: {
          zoomType: 'x'
      },
      title: {
          text: null
      },
      xAxis: {
          type: 'datetime'
      },
      yAxis: {
          title: {
              text: 'Frequency (MHz)'
          }
      },
      legend: {
          enabled: false
      },
      plotOptions: {
          area: {
              marker: {
                  radius: 2
              },
              lineWidth: 1,
              states: {
                  hover: {
                      lineWidth: 1
                  }
              },
              threshold: null
          }
      },

      series: [{
          type: 'line',
          data: data
      }]
  });
}

function graph_spreading_factor(data) {
  Highcharts.chart('chart_spreading_factor', {
      chart: {
          zoomType: 'x'
      },
      title: {
          text: null
      },
      xAxis: {
          type: 'datetime'
      },
      yAxis: {
          title: {
              text: 'Spreading Factor'
          }
      },
      legend: {
          enabled: false
      },
      plotOptions: {
          area: {
              marker: {
                  radius: 2
              },
              lineWidth: 1,
              states: {
                  hover: {
                      lineWidth: 1
                  }
              },
              threshold: null
          }
      },

      series: [{
          type: 'line',
          data: data
      }]
  });
}

function graph_packet_count(data) {
  Highcharts.chart('chart_packet_count', {
      chart: {
          zoomType: 'x'
      },
      title: {
          text: null
      },
      xAxis: {
          type: 'datetime'
      },
      yAxis: {
          title: {
              text: 'Packet Count'
          },
          min:0
      },
      legend: {
          enabled: false
      },
      plotOptions: {
          area: {
              marker: {
                  radius: 2
              },
              lineWidth: 1,
              states: {
                  hover: {
                      lineWidth: 1
                  }
              },
              threshold: null
          }
      },

      series: [{
          type: 'area',
          data: data
      }]
  });
}


function graph_gateway_count(data) {
  Highcharts.chart('chart_gateway_count', {
      chart: {
          zoomType: 'x'
      },
      title: {
          text: null
      },
      xAxis: {
          type: 'datetime'
      },
      yAxis: {
          title: {
              text: 'Gateway Count'
          },
          min:0
      },
      legend: {
          enabled: false
      },
      plotOptions: {
          area: {
              marker: {
                  radius: 2
              },
              lineWidth: 1,
              states: {
                  hover: {
                      lineWidth: 1
                  }
              },
              threshold: null
          }
      },

      series: [{
          type: 'line',
          data: data
      }]
  });
}
