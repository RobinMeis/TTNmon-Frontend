function device(hash) {
  if (hash[1] == undefined) {
    $("#content").html("<div class=\"container-fluid\"><div class=\"alert alert-danger\">Invalid device request</div></div>");
    $("#content").fadeIn(200);
  } else {
    $("#pseudonym_id").text(hash[1]);

    var options={ //Configure datepickers
      format: 'dd.mm.yyyy',
      todayHighlight: true,
      autoclose: true,
      weekStart: 1,
    };

    $("#date_start").datepicker(options);
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
