function getauthkey() {
  if (Cookies.get('auth_key') == undefined) { //Create a new key
    $.post( "https://api.beta.ttnmon.meis.space/api/token/")
    .done (function( data ) {
      auth_key = $.parseJSON( data );
      $("#auth_key").val(auth_key["auth_token"]);
      Cookies.set('auth_key', auth_key["auth_token"], { expires: 365, path: '' });
      $(".showloggedout").hide();
      $(".showloggedin").show();
    })
    .fail(function() {
      $("#error_msg").text("Failed to generate a new Authorization Key. Please retry later");
      $("#error_msg").fadeIn(200);
    })
  } else //Use existing key
    $("#auth_key").val(Cookies.get('auth_key'));
  $(".reveal").on('click', reveal_pwd);
  $( "#spinner" ).hide();
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
