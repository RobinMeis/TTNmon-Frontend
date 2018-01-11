function signin() {
  $("#content").fadeIn(200);

  if (Cookies.get('auth_key') == undefined) { //Not signed in
    $("#auth_key").on('keypress', key_check);
    $("#loginButton").click(signin_check);
    $("#signin-alert").hide();
  } else { //Already signed in
    $("#signin-mask").hide();
    $("#signin-alert").removeClass("alert-danger");
    $("#signin-alert").addClass("alert-success");
    $("#signin-alert").html("You are already Signed in. To sign in using another authorization key, please sign out first");
  }
}

function signin_check(){
  $.getJSON( "https://ttnmon.meis.space/api/device/?auth_token=" + $("#auth_key").val(), function( data ) {
    if (data["error"] == 0) {
      Cookies.set('auth_key', $("#auth_key").val(), { expires: 365, path: '' });
      $("#signin-alert").removeClass("alert-danger");
      $("#signin-alert").addClass("alert-success");
      $("#signin-alert").html("You have been successfully signed in. Please consider to store your key using your browsers password manager");
      $("#signin-alert").fadeIn();
      $("#signin-mask").hide();
      $('#loginForm').submit();
    } else {
      $("#signin-alert").removeClass("alert-success");
      $("#signin-alert").addClass("alert-danger");
      $("#signin-alert").html("Your authorization token is invalid");
      $("#signin-alert").fadeIn();
    }
  });
}

function key_check(e) {
  if(e.which === 13)
    signin_check();
}
