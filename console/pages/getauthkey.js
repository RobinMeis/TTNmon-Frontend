function getauthkey() {
  if (Cookies.get('auth_key') == undefined) { //Create a new key
    $.post( "https://ttnmon.meis.space/api/token/", function( data ) {
      auth_key = $.parseJSON( data );
      $("#auth_key").val(auth_key["auth_token"]);
      Cookies.set('auth_key', auth_key["auth_token"], { expires: 365, path: '' });
      $(".showloggedout").hide();
      $(".showloggedin").show();
    });
  } else //Use existing key
    $("#auth_key").val(Cookies.get('auth_key'));
  $( "#content" ).fadeIn(200);
}
