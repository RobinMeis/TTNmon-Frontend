function getauthkey() {
  $.post( "https://ttnmon.meis.space/api/token/", function( data ) {
    auth_key = $.parseJSON( data );
    $("#auth_key").val(auth_key["auth_token"]);
  });
  $( "#content" ).fadeIn(200);
}
