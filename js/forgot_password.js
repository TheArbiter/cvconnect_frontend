$(document).ready(function(){
    $("#submit").click(function(){  
        var email = $("#email").val();
        
        console.log("Sending request"); 
        
        var current_loc = window.location.href;
        var link_to_reset = current_loc.replace("forgot_password", "reset_password");
        console.log(current_loc);
        
        var user_request = {
            "email": email,
            "link": link_to_reset
        };        
        
        document.getElementById('submit').disabled = true; 
        
        // Sends the user request to the api to generate a password reset link
        $.ajax({
            url: apiurl + "/api/forgot-password/",
            method: "POST",
            data: JSON.stringify(user_request),
            contentType: 'application/json',
        }).error(function(jqXHR, textStatus, errorThrown) {
            //alert("Email " + email + " not found. Please try another email.");
            $('#forgot-password-errors').html('<div class="alert alert-danger" role="alert">' + email + ' not found!</div>');
            console.log("Failed Signup:", jqXHR.responseText);
            document.getElementById('submit').disabled = false; 
        }).success(function(user_response){
            console.log("Successful Signup:", user_response);
            alert("Email successfully sent to " + email + ".");
            window.location.href = "../index.html";
        });
        return false;
    });
    
    $("#homelink").click(function(){
        window.location.href = "../index.html";
    });
    
    $("#sign-up").click(function(){
        window.location.href = "register.html";
    });
    
    $("#cvconnect-banner").click(function(){
        window.location.href = "../index.html";
    });
    
    $("#email").keypress(function(e){
        if(e.keyCode == 13){
            event.preventDefault();
            $("#submit").click();
        }
    });
});
