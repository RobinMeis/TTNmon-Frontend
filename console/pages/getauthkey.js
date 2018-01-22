function getauthkey() {
  if (Cookies.get('auth_key') == undefined) { //Create a new key
    $.post( "https://api.ttnmon.meis.space/api/token/", function( data ) {
      auth_key = $.parseJSON( data );
      $("#auth_key").val(auth_key["auth_token"]);
      Cookies.set('auth_key', auth_key["auth_token"], { expires: 365, path: '' });
      $(".showloggedout").hide();
      $(".showloggedin").show();
    });
  } else //Use existing key
    $("#auth_key").val(Cookies.get('auth_key'));
  $(".reveal").on('click', reveal_pwd);
  $( "#content" ).fadeIn(200);
}

function reveal_pwd() {
  if ($("#pwd_reveal input").attr('type') == 'password') {
    $("#pwd_reveal input").attr('type', 'text');
    $("#pwd_reveal span button i").removeClass("fa-eye");
    $("#pwd_reveal span button i").addClass("fa-eye-slash");
  } else {
    $("#pwd_reveal input").attr('type', 'password');
    $("#pwd_reveal span button i").removeClass("fa-eye-slash");
    $("#pwd_reveal span button i").addClass("fa-eye");
  }
}
