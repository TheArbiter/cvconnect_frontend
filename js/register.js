$(document).ready(function(){
    $("#submit").click(function(){
        var username = $("#username").val();
        var email = $("#email").val();
        var initial_password = $("#password").val();
        var confirm_password = $("#confirm-password").val()
        var full_name = $("#full_name").val();
        var preferred_name = $("#preferred_name").val();
        var country = $("#country").val();

        var user_request = {
            "username": username,
            "password": initial_password,
            "email": email
        };

        $('#register-form-errors').html('');
        
        if (initial_password != confirm_password){
            //alert("Passwords do not match. Please re-enter.");
            //dismissable alerts from bootstrap.com examples
            $('#register-form-errors').append('<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Passwords must match</div>');
            document.getElementById("password").value = "";
            document.getElementById("confirm-password").value = "";
            return false;
        }
        
        if (initial_password.length < 8){
            //alert ("Password must be at least 8 characters long.");
            $('#register-form-errors').append('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Password must be at least 8 characters.</div>');
            return false;
        }
        
        
        console.log("Sending request");
        console.log(user_request);

        // Sends the user data to the api to create a user
        // this call should also create an empty profile for the user
        $.ajax({
            url: apiurl + "/api/users/",
            method: "POST",
            data: JSON.stringify(user_request),
            contentType: 'application/json',
        }).error(function(jqXHR, textStatus, errorThrown) {
            //alert(jqXHR.responseText);
            for (key in jqXHR.responseJSON) {
                 $('#register-form-errors').append('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' + jqXHR.responseJSON[key] + '</div>');
            }
            console.log("Failed Signup:", jqXHR.responseText);
        }).success(function(user_response){
            console.log("Successful Signup:", user_response);

            // Then we get the users auth token
            request = {
                "username": username,
                "password": initial_password
            };

            $.ajax({
                url: apiurl + "/api-token-auth/",
                method: "POST",
                data: JSON.stringify(request),
                contentType: 'application/json',
            }).error(function(jqXHR, textStatus, errorThrown) {
                //alert(jqXHR.responseText);
                for (key in jqXHR.responseJSON) {
                    alert(jqXHR.responseJSON[key]);
                }
                console.log("Failed Auth:", jqXHR.responseText);
            }).success(function(r){
                auth_token = r.token;
                console.log("Successful Auth:", auth_token);

                // Now we need to PATCH the users profile to contain the extra info
                var profile_request = {
                    "user": user_response.id,
                    "full_name": full_name,
                    "preferred_name": preferred_name,
                    "country": country
                };
                console.log(profile_request);

                // Now we need to store the token in localStorage so we can use it across the site
                localStorage.setItem("cvconnect_auth_token", auth_token);
                localStorage.setItem("cvconnect_username", username);

                $.ajax({
                    url: apiurl + '/api/profiles/' + username + '/',
                    method: 'PATCH',
                    data: JSON.stringify(profile_request),
                    contentType: 'application/json',
                    headers: {
                        Authorization: 'Token ' + auth_token
                    }
                }).error(function(jqXHR, textStatus, errorThrown) {
                    //alert(jqXHR.responseText);
                    for (key in jqXHR.responseJSON) {
                        alert(jqXHR.responseJSON[key]);
                    }
                    console.log("Failed Profile Patch:", jqXHR.responseText);
                }).success(function(r){
                    console.log("Successful Profile Patch");

                    // Redirect to the new profile page
                    window.location.href = "../html/profile.html";
                });

            });
        });
        return false;
    });

    $("#homelink").click(function(){
        window.location.href = "../home.html";
    });
    
    $("#cvconnect-banner").click(function(){
        window.location.href = "../home.html";
    });
});
