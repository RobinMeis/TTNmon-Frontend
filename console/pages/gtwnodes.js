var table = null;

function gtwnodes(hash) {
  if (hash[1] == undefined) {
    $("#content").html("<div class=\"container-fluid\"><div class=\"alert alert-danger\">Invalid device request</div></div>");
    $("#spinner").hide();
    $("#content").fadeIn(200);
  } else {
    hash.splice(0,1); //Reassemble gtw_eui
    gtw_eui = hash.join("-");
    $("#gtw_eui").text(gtw_eui);
    $.ajax( "https://api.ttnmon.meis.space/api/gateway/nodes/?gtw_eui=" + gtw_eui, {"dataType": 'json', "timeout": 3000})

    .done (function( data ) { //Get table data
      if (data["error"] == 0) {
        $.each(data["nodes"], function( key, node ) {
          if (node["locations"]["distance"] == null) node["locations"]["distance"] = "";
          else node["locations"]["distance"] = Math.round(node["locations"]["distance"]) / 1000;
          $("#nodeTable tbody").append("<tr data-name=\"" + node["dev_pseudonym"] + "\" id=\"" + node["dev_pseudonym"] + "\"><td>" + node["dev_pseudonym"] + "</td><td>" + node["time"] + "</td><td>" + node["snr"] + "</td><td>" + node["locations"]["distance"] + "</td><td style=\"text-align:center;\"><a href=\"#device-" + node["dev_pseudonym"] + "\"><i class=\"fa fa-eye\"></i></a></td></tr>");
        });

        table = $("#nodeTable").DataTable({ //jQuery DataTables
          columnDefs: [
            { targets: [4], orderable: false},
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
}
