function startpage() {
  $.ajax( "https://api.ttnmon.meis.space/api/stats/", {"dataType": 'json', "timeout": 3000})
  .done( function( data ) {
    if (data["error"] == 0) {
      $("#registered_devices").text(data["stats"]["devices"]["count"]);
      $("#authorization_tokens").text(data["stats"]["authorizations"]["count"]);
      $("#received_packets").text(commafy(data["stats"]["packets"]["count"]));
      $("#gateways").text(data["stats"]["unique_gateways"]["count"]);
    } else {
      $("#registered_devices").hide();
      $("#authorization_tokens").hide();
      $("#received_packets").hide();
      $("#gateways").hide();
    }
    $( "#spinner" ).hide();
    $( "#content" ).fadeIn(200);
  })
  .fail( function() {
    $("#spinner").hide();
    $("#content").fadeIn(200);
    $("#icon_cards").hide();
  });

  getBlog();
}

function getBlog() {
  $.getJSON( "https://robin.meis.space/wp-json/wp/v2/posts/?categories=267", function( data ) {
  var articles = "";
  $.each( data, function( key, article ) {
    date = new Date( article["date_gmt"]);
    date_string = ('0' + date.getDate()).slice(-2) + '.' + ('0' + (date.getMonth()+1)).slice(-2) + '.' + date.getFullYear();
    articles += '<div class="card mb-3"><div class="card-header">' + article["title"]["rendered"] + '</div><div class="card-body">' + article["content"]["rendered"] + '</div><div class="card-footer small text-muted">' + date_string + '</div></div>';

    /*

        <p>On 11.04.2018 at 06:10:09 UTC the 2.000.000th packet was received by TTNmon. It was sent by <a href="#device-23">this</a> node in Apeldoorn. So it's time for some stats!</p>
        <p>The database currently holds the data of 66 nodes sending their packets to 408 gateways. The packet table grows by about 17.000 packets per day. This table only stores the nodes information like packet time, counter or spreading factor. The main table which holds the link quality for each gateway which heard a packet stores currently 4.540.309 rows. It grows by ~34.000 rows per day.</p>
        <p>The packet table has a size of ~185 MB. The table storing link quality has a size of ~490 MB. The total database size including user and device table is about 680 MB which caused TTNmon becoming slow and unstable at my shared hosting provider within a short time after the public launch.</p>
        <p>In the beginning I cared less for database and dump size. Starting compressing them during the dump process significantly decreased the dumps size. But as of today even the compressed database dumps reached a size of 100 MB.</p>
        <p>When I introduced the Map the data was generated every 10 minutes by a cronjob. Later the cronjob started to hit memory limits. Even the basic job which created a list of all known gateways ran longer than 10 minutes. The job to process the colored links between nodes and gateways ran into timeout. The problem was fixed a few days ago. Now the required information are collected instantly when a new packet is received. This means that the map became more dynamic while the server has lower loads.</p>
        <p>As previously mentioned, TTNmon started to hit my hosters limits. Thanks to the support of the <a target="_blank" href="https://www.thethingsnetwork.org/community/aachen/">TTN Community Aachen</a> and <a target="_blank" href="https://ccc.ac/">CCCAC</a> I'm able to run TTNmon on a virtual server which provides the required ressources.</p>
        <p>Looking forward to 5.000.000 packets which should be reached within the next five to six months.</p>
    """*/
  });

  $("#blog").html(articles);
});
}

function commafy( num ) { //https://stackoverflow.com/questions/6784894/add-commas-or-spaces-to-group-every-three-digits
    var str = num.toString().split('.');
    if (str[0].length >= 5) {
        str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1.');
    }
    if (str[1] && str[1].length >= 5) {
        str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
}
