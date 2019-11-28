$(document).ready(function() {
  $("#signoutButton").click(sign_out);
  if (Cookies.get('auth_key') != undefined) {
    $(".showloggedout").hide();
    $(".showloggedin").show();
  } else {
    $(".showloggedin").hide();
  }
});

function signin() { //Runs on each page load
  $("#spinner").hide();
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
    $(".showloggedout").hide();
    $(".showloggedin").show();
  }
}

function signin_check(){ //Checks auth key
  $("#spinner").show();
  $.ajax({url:"https://api.beta.ttnmon.meis.space/v2/devices",
  beforeSend: function (xhr) {
    xhr.setRequestHeader ("Authorization", $("#auth_key").val());
  }, dataType: 'json', timeout: 3000})
  .done(function( data ) {
    $("#spinner").hide();
    if (data["error"] == 0) {
      Cookies.set('auth_key', $("#auth_key").val(), { expires: 365, path: '' });
      $("#signin-alert").removeClass("alert-danger");
      $("#signin-alert").addClass("alert-success");
      $("#signin-alert").html("You have been successfully signed in. Please consider to store your key using your browsers password manager");
      $("#signin-alert").fadeIn();
      $("#signin-mask").hide();
      $(".showloggedout").hide();
      $(".showloggedin").show();
      $('#loginForm').submit();
    } else {
      $("#signin-alert").removeClass("alert-success");
      $("#signin-alert").addClass("alert-danger");
      $("#signin-alert").html("Your authorization token is invalid");
      $("#signin-alert").fadeIn();
    }
  })

  .fail(function() {
    $("#spinner").hide();
    $("#signin-alert").removeClass("alert-success");
    $("#signin-alert").addClass("alert-danger");
    $("#signin-alert").html("Checking your Authorization Key failed. Please try again later");
    $("#signin-alert").fadeIn();
  });
}

function key_check(e) { //handles pressing enther in input field
  if(e.which === 13)
    signin_check();
}

function sign_out() {
  Cookies.remove('auth_key', { path: '' });
  $(".showloggedout").show();
  $(".showloggedin").hide();
  window.location.replace("#")
  $('#logoutModal').modal('toggle');
}
