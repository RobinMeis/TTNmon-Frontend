var table = null;

function mydevices() {
  $.getJSON( "https://api.ttnmon.meis.space/api/device/?auth_token=" + Cookies.get('auth_key'))

  .done (function( data ) { //Get table data
    if (data["error"] == 0) {
      $.each(data["devices"], function( key, device ) {
        $("#devTable tbody").append("<tr id=\"" + device["deveui"] + "\"><td>" + device["deveui"] + "</td><td>" + device["app_id"] + "</td><td>" + device["dev_id"] + "</td><td>" + device["pseudonym"] + "</td><td>" + device["created"] + "</td><td>" + device["last_seen"] + "</td><td><a href=\"#device-" + device["pseudonym"] + "\"><i class=\"fa fa-eye\"></i></a> <a href=\"#mydevices\" class=\"delButton\"><i class=\"fa fa-trash\"></i></a></td></tr>");
      });

      table = $("#devTable").DataTable({ //jQuery DataTables
        columnDefs: [
          { targets: [5], orderable: false},
        ],
        "initComplete": function(settings, json) { //Show table after complete
          $( "#content" ).fadeIn(200, function() {
            table.columns.adjust();
          });
        }
      });
      $('#devTable tbody').on( 'click', 'a.delButton', remove_item); //Delete device button
    } else {
      $("#error_msg").text(data["msg_en"]);
      $("#error_msg").show();
      $( "#content" ).fadeIn();
    }
  })

  .fail(function() {
    $("#error_msg").text("Failed to retrieve devices. Please try again later");
    $("#error_msg").show();
    $( "#content" ).fadeIn();
    }
  );
}

function remove_item() {
  var table_row = $(this).parents('tr');

  $.ajax({
    url: "https://api.ttnmon.meis.space/api/device/?auth_token=" + Cookies.get('auth_key') + "&deveui=" + table_row.attr("id"),
    type: "DELETE"
  })

  .done(function(result) { //Remove if request was successful
    if (result["error"] == 0)
      table.row(table_row).remove().draw();
    else {
      $("#error_msg").text(result["msg_en"]);
      $("#error_msg").fadeIn();
      table_row.fadeIn();
    }
  })

  .fail(function() { //show again if delete failed
    $("#error_msg").text("Device removal failed. Please try again later");
    $("#error_msg").fadeIn();
    table_row.fadeIn();
  });

  $("#error_msg").fadeOut();
  table_row.fadeOut(); //hide, but don't remove


}
