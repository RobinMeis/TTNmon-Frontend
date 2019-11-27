var table = null;

function gateways() {
  $.ajax( "https://api.beta.ttnmon.meis.space/api/gateway/list/", {"dataType": 'json', "timeout": 3000})

  .done (function( data ) { //Get table data
    if (data["error"] == 0) {
      $.each(data["gateways"], function( key, gateway ) {
        if (gateway["description"] == null) gateway["description"] = "";
        $("#gtwTable tbody").append("<tr data-name=\"" + gateway["gtw_id"] + "\" id=\"" + gateway["gtw_id"] + "\"><td>" + gateway["gtw_id"] + "</td><td>" + gateway["first_seen"] + "</td><td>" + gateway["last_seen"] + "</td><td>" + gateway["packets"] + "</td><td>" + gateway["description"] + "</td><td style=\"text-align:center;\"><a href=\"#gtwnodes-" + gateway["gtw_id"] + "\"><i class=\"fa fa-eye\"></i></a></td></tr>");
      });

      table = $("#gtwTable").DataTable({ //jQuery DataTables
        columnDefs: [
          { targets: [4,5], orderable: false},
        ],
        "initComplete": function(settings, json) { //Show table after complete
          $("#spinner").hide();
          $( "#content" ).fadeIn(200, function() {
            table.columns.adjust();
          });
        }
      });
    } else {
      $("#error_msg").text(data["msg_en"]);
      $("#error_msg").show();
      $("#spinner").hide();
      $("#content").fadeIn();
    }
  })

  .fail(function() {
    $("#error_msg").text("Failed to retrieve gateways. Please try again later");
    $("#error_msg").show();
    $("#device_card").hide();
    $("#spinner").hide();
    $("#content").fadeIn();
    }
  );
}
