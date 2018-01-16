function device_gateways() {
  $(".gateway_select").click(function(e) { //Gateway button click
    load_gateway(hash[1], $(this).attr('id'), $('#date_start').datepicker("getDate"), $('#date_end').datepicker("getDate"));
  });

  $("#gtw_hide").click(function(e) { //Gateway button click
    hide_gateways();
  });
}

function load_gateway(dev_pseudonym, gtw_id, date_start, date_end) {
  $(".gtw_id").text(gtw_id);
  $("#gtw_hide").attr("href", location.hash);

  var string_start = date_start.getFullYear() + "-" + (date_start.getMonth() + 1) + "-" + date_start.getDate();
  var string_end = date_end.getFullYear() + "-" + (date_end.getMonth() + 1) + "-" + date_end.getDate() + " 23:59:59";

  $.getJSON( "https://api.ttnmon.meis.space/api/gateway/device/?dev_pseudonym=" + dev_pseudonym + "&date_start=" + string_start + "&date_end=" + string_end + "&gtw_id=" + gtw_id)
    .done(function(data) {
      var channel = [];
      var snr = [];
      var rssi = [];

      $.each(data["packets"], function(index, packet) {
        date = Date.parse(packet["time"])
        channel.push([date, packet["channel"]]);
        snr.push([date, packet["snr"]]);
        rssi.push([date, packet["rssi"]]);
      });
      graph_gtw_channel(channel);
      graph_gtw_snr(snr);
      graph_gtw_rssi(rssi);
      $(".gtw_graph").fadeIn();
    })
    .fail(function() {
      alert("Request failed");
    });
}

function hide_gateways() {
  $(".gtw_graph").fadeOut();
}

function graph_gtw_channel(data) {
  Highcharts.chart('chart_channel_gtw', {
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
              text: 'Channel'
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

function graph_gtw_snr(data) {
  Highcharts.chart('chart_snr_gtw', {
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
              text: 'SNR'
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

function graph_gtw_rssi(data) {
  Highcharts.chart('chart_rssi_gtw', {
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
              text: 'RSSI'
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
