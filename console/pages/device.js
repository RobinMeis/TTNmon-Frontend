function device(hash) {
  if (hash[1] == undefined) {
    $("#content").html("<div class=\"container-fluid\"><div class=\"alert alert-danger\">Invalid device request</div></div>");
    $("#spinner").hide();
    $("#content").fadeIn(200);
  } else {
    if (hash[2] != null && hash[3] != null) {
      var date_start = moment(hash[2],"DD.MM.YYYY");
      var date_end = moment(hash[3],"DD.MM.YYYY");
    } else {
      var date_start = null;
      var date_end = null;
    }
    timezoneButtons(); //Configure timezone
    $('input[type=radio][name=timezone]').change(timezone_change); //Timezone change button

    $("#pseudonym_id").text("Device " + hash[1]);
    $("#maplink").attr("href", "#map-" + hash[1]);

    setup_datepickers(date_start, date_end);
    get_device_details();
    get_packets(hash[1], $('#date_start').datepicker("getDate"), $('#date_end').datepicker("getDate"), false); //Get packets for (default) date range

    $("#update_date").click(update_date_button);
  }
}

function get_device_details() {
  $.ajax( "https://api.beta.ttnmon.meis.space/v2/device/" + hash[1], {"dataType": 'json', "timeout": 10000, beforeSend: function(xhr){xhr.setRequestHeader('Authorization', Cookies.get('auth_key'));},},)
    .done (function( data ) { //Get table data
      if (data["error"] == 0) {
        if (data["authorized"]) {
          $("#breadcrumb_pseudonym").remove();
          $("#breadcrumb").append('<li class="breadcrumb-item">' + data["device"]["appID"] + '</li><li class="breadcrumb-item active">' + data["device"]["devID"] + ' <span class="font-weight-light">(' + data["device"]["devEUI"] + ")</span></li>");
        }
      }
    }).fail(function(data) {
      alert("device not found");
    });
}

function setup_datepickers(date_start=null, date_end=null) {
  var options={ //Configure datepickers
    format: 'dd.mm.yyyy',
    todayHighlight: true,
    autoclose: true,
    weekStart: 1,
  };

  $("#date_start").datepicker(options);
  $("#date_end").datepicker(options);

  var now = new Date();
  if (date_start != null && date_end != null) {
    var start = date_start.toDate();
    var end = date_end.toDate();
  } else {
    if (Cookies.get('timezone') == 'local') { //Set dates
      var start = new Date(now.getFullYear(), now.getMonth(), now.getDate(),  now.getHours(), now.getMinutes(), now.getSeconds());
      var end = new Date(now.getFullYear(), now.getMonth(), now.getDate(),  now.getHours(), now.getMinutes(), now.getSeconds());
    } else {
      var start = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
      var end = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),  now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
    }
    start.setDate(start.getDate() - 7);
    update_hash(hash[0] + "-" + hash[1] + "-" + start.getDate() + "." + (start.getMonth() + 1) + "." + start.getFullYear() + "-" + end.getDate() + "." + (end.getMonth() + 1) + "." + end.getFullYear(), true); //Update hash with new dates
  }
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
}

function timezoneButtons() { //Apply timezone to data
  if (Cookies.get('timezone') == undefined) {
    Cookies.set('timezone', 'utc');
  }
  var timezone = Cookies.get('timezone');
  if (timezone == 'local') {
    $("#timezone_local input").prop('checked', true);
    $("#timezone_local").addClass('active');
  } else {
    $("#timezone_utc input").prop('checked', true);
    $("#timezone_utc").addClass('active');
  }
}

function timezone_change() { //Event for timezone radio buttons
  if (this.value == 'utc') {
      Cookies.set('timezone', 'utc');
  } else if (this.value == 'local') {
      Cookies.set('timezone', 'local');
  }
  setup_datepickers();
  $("#update_date").fadeIn();
}

function get_timeOffset() {
  if (Cookies.get('timezone') == 'local') {
    var date = new Date();
    return (date.getTimezoneOffset());
  } else {
    return (0);
  }
}
