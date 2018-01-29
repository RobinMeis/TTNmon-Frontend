function dumps() {
  $.getJSON( "https://api.ttnmon.meis.space/api/dumps/" )

  .done (function( data ) { //Get table data
      $.each(data["dumps"], function( key, dump ) {
        $("#dumpTable tbody").append("<tr><td>" + dump["filename"] + "</td><td>" + Math.round(dump["filesize"] / 100000) / 10 + " MB</td><td>" + dump["sha256"] + "</td><td style=\"text-align:center;\"><a href=\"" + dump["download_url"] + "\"><i class=\"fa fa-download\"></i></a></td></tr>");
      });

      table = $("#dumpTable").DataTable({ //jQuery DataTables
        columnDefs: [
          { targets: [3], orderable: false},
        ],
        order: [[0, 'desc']],
        "initComplete": function(settings, json) { //Show table after complete
          $("#spinner").hide();
          $("#content").fadeIn(200, function() {
            table.columns.adjust();
          });
        }
      });
  })
}
