$(document).ready(function () {
   $('.loader-overlay').hide();
   setTimeout(function() {
        $("#error-msg").fadeOut();
    }, 5000);
    $("#togglePassword").click(function() {
        var passwordField = $("#password");
        var passwordFieldType = passwordField.attr("type");

        if (passwordFieldType === "password") {
            passwordField.attr("type", "text");
            $("#togglePassword").removeClass("fa-eye-slash").addClass("fa-eye");
        } else {
            passwordField.attr("type", "password");
            $("#togglePassword").removeClass("fa-eye").addClass("fa-eye-slash");
        }
    });
});