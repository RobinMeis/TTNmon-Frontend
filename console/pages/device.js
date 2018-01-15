function device(hash) {
  if (hash[1] == undefined) {
    $("#content").html("<div class=\"container-fluid\"><div class=\"alert alert-danger\">Invalid device request</div></div>");
    $("#content").fadeIn(200);
  } else {
    var options={
      format: 'dd.mm.yyyy',
      todayHighlight: true,
      autoclose: true,
      weekStart: 1,
    };

    $("#date_start").datepicker(options); //Configure datepickers
    $("#date_end").datepicker(options);

    var start = new Date(); //Set dates
    var end = new Date();
    start.setMonth(start.getMonth() - 1);
    $('#date_start').datepicker("setDate", start);
    $('#date_end').datepicker("setDate", end);
    $('#date_end').datepicker("setStartDate", start);
    $('#date_start').datepicker("setEndDate", end);

    $("#date_start").datepicker().on("changeDate", function(e) { //Configure update events
      $('#date_end').datepicker("setStartDate", e.date);
      $("#update_date").fadeIn();
    });

    $("#date_end").datepicker().on("changeDate", function(e) {
      $('#date_start').datepicker("setEndDate", e.date);
      $("#update_date").fadeIn();
    });

    get_packets(hash[1], $('#date_start').datepicker("getDate"), $('#date_end').datepicker("getDate"), false); //Get packets for (default) date range
    $("#update_date").click(update_date_button);
  }
}

function get_packets(dev_pseudonym, date_start, date_end) {
  date_end.setHours(23);
  date_end.setMinutes(59);
  date_end.setSeconds(59);
  var string_start = date_start.getFullYear() + "-" + (date_start.getMonth() + 1) + "-" + date_start.getDate();
  var string_end = date_end.getFullYear() + "-" + (date_end.getMonth() + 1) + "-" + date_end.getDate() + " " + date_end.getHours() + ":" + date_end.getMinutes() + ":" + date_end.getSeconds();
  $.getJSON( "https://ttnmon.meis.space/api/packet/?dev_pseudonym=" + dev_pseudonym + "&date_start=" + string_start + "&date_end=" + string_end, function( data ) {
    $("#update_date").hide();
    $("#SF_min").text(data["packet_stats"]["SF_min"]); //packet stats
    $("#SF_max").text(data["packet_stats"]["SF_max"]);
    $("#packets").text(data["packet_stats"]["packets"]);

    $("#gateways").html("");
    $.each(data["gateways"], function(key, gateway) {
      $("#gateways").append('<a class="list-group-item list-group-item-action" href="#"><div class="media"><div class="media-body"><strong>' + gateway["gtw_id"] + '</strong><br>Packets: ' + gateway["packets"] + '<br>RSSI min: ' + gateway["rssi_min"] + '<br>RSSI max: ' + gateway["rssi_max"] + '<br>SNR min: ' + gateway["snr_min"] + '<br>SNR max: ' + gateway["snr_max"] + '<div class="text-muted smaller">' + gateway["lat"] + ' | ' + gateway["lon"] + ' | ' + gateway["alt"] + 'm</div></div></div></a>')
    });

    spreading_factor = []; //Prepare graphs
  	frequency = [];
  	packet_count = [];
  	$.each(data["packets"], function (index, packet) {
  		date = Date.parse(packet["time"])
  		spreading_factor.push([date, packet["SF"]]);
  		frequency.push([date, packet["frequency"]]);
  		packet_count.push([date, packet["packet_count"]]);

  	});

    graph_frequency(frequency); //Generate graphs
    graph_spreading_factor(spreading_factor);
    graph_packet_count(packet_count);

    $( "#content" ).fadeIn(200);
  });
}

function update_date_button() {
  $( "#content" ).fadeOut(200);
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
              text: 'Spreding Factor'
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
          type: 'area',
          data: data
      }]
  });
}
