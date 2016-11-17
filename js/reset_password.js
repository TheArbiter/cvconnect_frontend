function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


$(document).ready(function(){
    $("#submit-button").click(function(){
        var initial_password = $("#password").val();
        var confirm_password = $("#confirm-password").val()

        $('#reset-password-errors').html('');
        
        if (initial_password != confirm_password){
            //alert("Passwords do not match. Please re-enter.");
            $('#reset-password-errors').append('<div class="alert alert-warning" role="alert">Passwords need to match</div>');
            document.getElementById("password").value = "";
            document.getElementById("confirm-password").value = "";
            return false;
        }
        
        if (initial_password.length < 8){
            //alert ("Password must be at least 8 characters long.");
            $('#reset-password-errors').append('<div class="alert alert-danger" role="alert">Password must be at least 8 characters long</div>');
            return false;
        }
        
        var user_request = {
            "token": getParameterByName("token"),
            "password": initial_password
        };  
        
        
        console.log("Sending request");
        console.log(user_request);

        // Sends the user data to the api to create a user
        // this call should also create an empty profile for the user
        $.ajax({
            url: apiurl + "/api/reset-password/",
            method: "POST",
            data: JSON.stringify(user_request),
            contentType: 'application/json',
        }).error(function(jqXHR, textStatus, errorThrown) {
            //alert(jqXHR.responseText);
            for (key in jqXHR.responseJSON) {
                 $('#reset-password-errors').append('<div class="alert alert-danger" role="alert">' + jqXHR.responseJSON[key] + '</div>');
            }
            console.log("Failed Signup:", jqXHR.responseText);
        }).success(function(user_response){
            console.log("Successful Signup:", user_response);
            alert("Password successfully changed.");
            window.location.href = "../home.html";
        });
        return false;
    });
    
    $("#homelink").click(function(){
        window.location.href = "../home.html";
    });
    
    $("#sign-up").click(function(){
        window.location.href = "register.html";
    });
    
    $("#cvconnect-banner").click(function(){
        window.location.href = "../home.html";
    });
});
