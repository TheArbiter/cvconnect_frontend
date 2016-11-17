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
    var cvconnect_auth_token = localStorage.cvconnect_auth_token;
    var username = localStorage.cvconnect_username;
    
    $("#update-password").click(function(){
        var initial_password = $("#password").val();
        var new_password = $("#new-password").val()
        var confirm_new_password = $("#confirm-new-password").val()
        
        if (new_password != confirm_new_password){
            //alert("Passwords do not match. Please re-enter.");
            //dismissable alerts from bootstrap.com examples
            $('#user-settings-errors').append('<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Passwords must match</div>');
            document.getElementById("new-password").value = "";
            document.getElementById("confirm-new-password").value = "";
            return false;
        }
        
        if (new_password.length < 8){
            //alert ("Password must be at least 8 characters long.");
            $('#user-settings-errors').append('<div class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Password must be at least 8 characters.</div>');
            return false;
        }
        
        var user_request = {
            "username": username,
            "current_password": initial_password,
            "new_password": new_password,
        };
        
        $.ajax({
            url: apiurl + "/api/users/" + username + "/change-password/",
            method: "POST",
            data: JSON.stringify(user_request),
            contentType: 'application/json',
        }).error(function(jqXHR, textStatus, errorThrown) {
            $('#user-settings-errors').append('<div class="alert alert-danger" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>Incorrect password. Please try again.</div>');
            document.getElementById("password").value = "";
        }).success(function(r){
            //delete auth token
            //set new one
            
            alert("Password successfully updated.");
            document.getElementById("password").value = "";
            document.getElementById("new-password").value = "";
            document.getElementById("confirm-new-password").value = "";

        });
        
        return false;
    });
    
    $("#update-email").click(function(){
        var email = $("#email").val();
        console.log(email);
        var user_request = {
            "email": email
        };
        
        $.ajax({
            url: apiurl + "/api/users/" + username + "/",
            method: "PATCH",
            data: JSON.stringify(user_request),
            contentType: 'application/json',
            headers: {
                Authorization: 'Token ' + cvconnect_auth_token
            }
        }).error(function(jqXHR, textStatus, errorThrown) {
            alert("Invalid Email Address");
            console.log("Failed Profile Patch:", jqXHR.responseText);
            //document.getElementById("email").value = "";
        }).success(function(r){
            alert("Email successfully changed");
            document.getElementById("email").value = "";
        });
        
        return false;
    });

    $("#homelink").click(function(){
        window.location.href = "profile.html";
        return false;
    });
    
    $("#cvconnect-banner").click(function(){
        window.location.href = "profile.html";
        return false;
    });
    
    $("#profile-link").click(function(){
        window.location.href = "profile.html";
        return false;
    });
    
    $("#edit-settings").click(function(){
        window.location.href = "user_settings.html";
        return false;
    });
    
    $("#search-bar").keyup(function(event){
        if(event.keyCode == 13){
            $("#submit-search").click();
        }
    });
    
    $("#submit-search").click(function(){
        var query = $("#search-bar").val();
        window.location.href = "../html/search_results.html?query=" + query;
        return false;
    });
    
    $("#job-postings").click(function(){
        window.location.href = "job_display.html";
        return false;
    });
    
    $("#create-new-job").click(function(){
        // Make a blank job posting for the user
        var job_request = {
            "recruiter": username
        };

        $.ajax({
            url: apiurl + '/api/jobs/',
            method: 'POST',
            data: JSON.stringify(job_request),
            contentType: 'application/json',
            headers: {
                Authorization: 'Token ' + cvconnect_auth_token
            }
        }).error(function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
            console.log("Failed Job Creation:", jqXHR.responseText);
        }).success(function(r){
            console.log("Successful Job Creation");

            // Redirect to the new profile page
            window.location.href = "../html/job_display.html?new=true&jid=" + r.id;
        });
        return false;
    });
});
