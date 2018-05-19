function device(hash) {
  if (hash[1] == undefined) {
    $("#content").html("<div class=\"container-fluid\"><div class=\"alert alert-danger\">Invalid device request</div></div>");
    $("#content").fadeIn(200);
  } else {
    $("#pseudonym_id").text("Device " + hash[1]);
    $("#maplink").attr("href", "#map-" + hash[1]);

    var options={ //Configure datepickers
      format: 'dd.mm.yyyy',
      todayHighlight: true,
      autoclose: true,
      weekStart: 1,
    };

    $("#date_start").datepicker(options);
    $("#date_end").datepicker(options);

    var now = new Date();
    var start = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds()); //Set dates
    var end = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    start.setDate(start.getDate() - 7);
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
    get_device_details();
    $("#update_date").click(update_date_button);
  }
}

function get_device_details() {
  $.ajax( "https://api.ttnmon.meis.space/api/device/?auth_token=" + Cookies.get('auth_key') + "&pseudonym=" + hash[1], {"dataType": 'json', "timeout": 3000})

  .done (function( data ) { //Get table data
    if (data["error"] == 0) {
      $("#breadcrumb_pseudonym").remove();
      $("#breadcrumb").append('<li class="breadcrumb-item">' + data["app_id"] + '</li><li class="breadcrumb-item active">' + data["dev_id"] + ' <span class="font-weight-light">' + data["deveui"] + "</span></li>");
    }
  }

  );
}
