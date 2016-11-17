$(document).ready(function(){
    $("#submit").click(function(){
        var username = $("#username").val();
        var initial_password = $("#password").val();

	$('#wrong_login').html('');

        var request = {
            "username": username,
            "password": initial_password
        };

        console.log("Sending request");
        console.log(request);

        $.ajax({
            url: apiurl + "/api-token-auth/",
            method: "POST",
            data: JSON.stringify(request),
            contentType: 'application/json',
        }).error(function(jqXHR, textStatus, errorThrown) {
            $('#wrong_login').append('<div class="alert alert-danger" role="alert">Incorrect username or password!</div>');
            //alert("Incorrect username or password");
            document.getElementById("password").value = "";
        }).success(function(r){
            console.log("Successful Auth:", r.token);
            // Now we need to store the token in localStorage so we can use it across the site
            localStorage.setItem("cvconnect_auth_token", r.token);
            localStorage.setItem("cvconnect_username", username);

            // Redirect to the profile page
            window.location.href = "html/profile.html?username=" + username;
        });
        return false;
    });
});

    
