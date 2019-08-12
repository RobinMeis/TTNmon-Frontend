var table = null;

function mydevices() {
  $.ajax({url:"https://api.beta.ttnmon.meis.space/api/getDevices",
    beforeSend: function (xhr) {
      xhr.setRequestHeader ("Authorization", Cookies.get('auth_key'));
    }, dataType: 'json', timeout: 3000})

  .done (function( data ) { //Get table data
    if (data["error"] == 0) {
      $.each(data["devices"], function( key, device ) {
        $("#devTable tbody").append("<tr data-name=\"" + device["devID"] + "\" id=\"" + device["devEUI"] + "\"><td>" + device["devEUI"] + "</td><td>" + device["appID"] + "</td><td>" + device["devID"] + "</td><td>" + device["pseudonym"] + "</td><td>" + device["created"] + "</td><td>" + device["lastSeen"] + "</td><td style=\"text-align:center;\"><a href=\"#device-" + device["pseudonym"] + "\"><i class=\"fa fa-eye\"></i></a>&nbsp;&nbsp;&nbsp;<a href=\"#mydevices\" class=\"delButton\"><i class=\"fa fa-trash\"></i></a></td></tr>");
      });

      table = $("#devTable").DataTable({ //jQuery DataTables
        columnDefs: [
          { targets: [6], orderable: false},
        ],
        "initComplete": function(settings, json) { //Show table after complete
          $("#spinner").hide();
          $( "#content" ).fadeIn(200, function() {
            table.columns.adjust();
          });
        }
      });
      $('#devTable tbody').on( 'click', 'a.delButton', remove_item_modal); //Delete device button
      $('#deleteModal').on( 'click', '#confirm_delete', remove_item);
    } else {
      $("#error_msg").text(data["msg_en"]);
      $("#error_msg").show();
      $("#spinner").hide();
      $("#content").fadeIn();
    }
  })

  .fail(function() {
    $("#error_msg").text("Failed to retrieve devices. Please try again later");
    $("#error_msg").show();
    $("#device_card").hide();
    $("#spinner").hide();
    $("#content").fadeIn();
    }
  );
}

function remove_item_modal() {
  $("#deleteModal").modal();
  var table_row = $(this).parents('tr');
  $("#deleteModal .name").text(table_row.attr("data-name"));
  $("#deleteModal #confirm_delete").attr("data-id", table_row.attr("id"));
}

function remove_item() {
  var table_row = $("#devTable tbody #" + $(this).attr("data-id"));
  $.ajax({
    url: "https://api.beta.ttnmon.meis.space/api/device/" + table_row.attr("id"),
    beforeSend: function (xhr) {
      xhr.setRequestHeader ("Authorization", Cookies.get('auth_key'));
    },
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
