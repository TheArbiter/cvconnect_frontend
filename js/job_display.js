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
    // Make a call to the api to get the profile data

    var cvconnect_auth_token = localStorage.cvconnect_auth_token;
    var username = localStorage.cvconnect_username;

    var jid = getParameterByName("jid");

    if (!cvconnect_auth_token) {
        window.location.href = "../html/not_found.html";
    } else {
        if (jid) {
            $.getJSON(apiurl + "/api/jobs/" + jid + "/", function(result){
                $("#job__position").append(result.position);
                $("#job__company").append(result.company);
                $("#job__compensation").append(result.compensation);
                $("#job__description").append(result.description);
                $("#posted-time").html("Posted " + result.created + " ago");

                if (getParameterByName('new') == null) {
                    $("#position").val(result.position);
                    $("#company").val(result.company);
                    $("#compensation").val(result.compensation);
                    $("textarea#description").val(result.description);
                }

                // If not the recruiter then you shouldnt be able to edit or see applications
                if (username !== result.recruiter){
                    $('#edit-listing-tab').hide();
                    $('#edit_listing').hide();
                    $("#applications-tab").hide();
                    $("#applications").hide();
                } else {
                    $("#apply").hide();

                    // Fill application list
                    $.getJSON(apiurl + "/api/jobs/" + jid + "/applications/?recruit=true", function(applicants) {
                        for (index in applicants) {
                            var applicant = applicants[index];
                            if (applicant.status === 'Pending') {
                                $("#application_list").append(
                                    '<div class="panel panel-default" id="applicant-' + applicant.app_id + '">' +
                                        '<div class="panel-heading"><a href="profile.html?username=' + applicant.username + '" id="full_name">' + applicant.full_name + '</a></div>' +
                                        '<div class="panel-body">' +
                                            '<p id="role"> <strong>Current Position </strong>' + applicant.current_position + '</p>' +
                                            '<p id="company"> <strong>Current Company </strong>' + applicant.current_company + '</p>' +
                                            '<p id="skills"> <strong>Skills </strong>' + applicant.skills + '</p>' +
                                        '</div>' +
                                    '<button class="btn btn-danger rejection" type="button" id="reject-' + applicant.app_id + '-' + applicant.username + '">Reject</button>' +
                                    '<button class="btn btn-success acception" type="button" id="accept-' + applicant.app_id + '-' + applicant.username + '">Accept</button>'+
                                    '</div>'

                                );
                            } else {
                                $("#application_list").append(
                                    '<div class="panel panel-default" id="applicant-' + applicant.app_id + '">' +
                                        '<div class="panel-heading">Please contact: <a href="profile.html?username=' + applicant.username + '" id="full_name">' + applicant.full_name + '</a></div>' +
                                        '<div class="panel-body">' +
                                            '<p style="color: green;">Accepted</p>' +
                                            '<p id="role"> <strong>Current Position </strong>' + applicant.current_position + '</p>' +
                                            '<p id="company"> <strong>Current Company </strong>' + applicant.current_company + '</p>' +
                                            '<p id="skills"> <strong>Skills </strong>' + applicant.skills + '</p>' +
                                        '</div>' +
                                    '</div>'
                                );
                            }
                        }
                    });

                }

                $.getJSON(apiurl + "/api/profiles/" + username + "/application_ids/", function(app_ids) {
                    for (index in app_ids) {
                        if (app_ids[index] == jid) {
                            $("#apply").prop("disabled",true);
                            $("#apply").html("Applied");
                        }
                    }
                });

            }).fail(function(){
                // If the user does not exist, go to the 404 page
                window.location.href = "../html/not_found.html";
            });
        } else {
            $('#edit-listing-tab').hide();
            $('#applications-tab').hide();

            // No job id so we list the jobs the user has posted
            $.getJSON(apiurl + "/api/profiles/" + username + "/postings/", function(results){
                $("#job_container").html('');
                for (index in results) {
                    var result = results[index];
                    console.log(result);
                    $("#job_container").append(
                        '<a href="?jid=' + result.id + '">' +
                        '<div class="jobcontainer">' +
                            '<div class="job-listing job-listing--featured">' +
                              '<div class="row">' +
                                '<div class="col-sm-12 col-md-6">' +
                                  '<div class="row">' +
                                    '<!--<div class="col-xs-2"><img src="../img/apple.png" alt="AirBnb " class="img-responsive"></div>-->' +
                                    '<div class="col-xs-10">' +

                                      '<h4 class="job__position">'+ result.position +'</h4>' +
                                      '<h5 class="job__company">'+ result.company +'</h5>' +
                                      '<p>'+result.description+'</p>' +

                                    '</div>' +
                                  '</div>' +
                                '</div>' +
                                '<div class="col-xs-10 col-xs-offset-2 col-sm-4 col-sm-offset-0 col-md-2">' +
                                  '<p id="posted-time">'+ "Posted " + result.created + " ago" + '</p>' +
                                '</div>' +
                              '</div><!-- ./row -->' +
                            '</div><!-- ./job-listing --> ' +
                          '</div><!-- ./jobcontainer -->' +
                        '</a>'

                    );
                }
            });
        }
    }

    if (getParameterByName('new')) {
        $('#job-listing-tab').toggleClass('active', false);
        $('#job_listing').attr('class', 'tab-pane fade');

        $('#edit-listing-tab').toggleClass('active', true);
        $('#edit_listing').attr('class', 'tab-pane fade in active');
    }
    
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

    $("#job-postings").click(function(){
        window.location.href = "job_display.html";
        return false;
    });
    
    // Create a blank job and redirect use to the jobs page ready to edit.
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


    // Submit the job for patch
    $("#submit").click(function() {

        var position = $("#position").val();
        var company = $("#company").val();
        var compensation = $("#compensation").val();
        var description = $("textarea#description").val();

        var job_request = {
            "position": position,
            "company": company,
            "compensation": compensation,
            "description": description
        };

        console.log(job_request);

        $.ajax({
            url: apiurl + '/api/jobs/' + jid + '/',
            method: 'PATCH',
            data: JSON.stringify(job_request),
            contentType: 'application/json',
            headers: {
                Authorization: 'Token ' + cvconnect_auth_token
            }
        }).error(function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
            console.log("Failed Job Patch:", jqXHR.responseText);
        }).success(function(r){
            console.log("Successful Job Patch");

            // Redirect to the new profile page
            window.location.href = "../html/job_display.html?jid=" + r.id;
        });

        return false;
    });

    // Apply for a job
    $("#apply").click(function() {
        var application = {
            "job_posting": jid,
            "profile": username
        };

        console.log(application);
        $("#apply").prop("disabled",true);
        $.ajax({
            url: apiurl + '/api/jobs/' + jid + '/applications/',
            method: 'POST',
            data: JSON.stringify(application),
            contentType: 'application/json',
            headers: {
                Authorization: 'Token ' + cvconnect_auth_token
            }
        }).error(function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
            console.log("Failed Job Application:", jqXHR.responseText);
            $("#apply").prop("disabled",false);
        }).success(function(r){
            console.log("Successful Job Application");

            // Redirect to the new profile page

            $("#apply").html("Applied");

        });
    });

    // Reject
    $('#application_list').on('click', '.rejection', function(event){
        // Update the job application status and remove the applicant from viewing
        app_id = event.target.id.split('-')[1];
        console.log(app_id);

        var patch_req = {
            "id": app_id,
            "status": 'Rejected'
        };
        $.ajax({
            url: apiurl + '/api/jobs/' + jid + '/applications/' + app_id + '/',
            method: 'PATCH',
            data: JSON.stringify(patch_req),
            contentType: 'application/json',
            headers: {
                Authorization: 'Token ' + cvconnect_auth_token
            }
        }).error(function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
            console.log("Failed Job Application Patch:", jqXHR.responseText);
        }).success(function(r){
            console.log("Successful Job Application Patch");

            $("#applicant-" + app_id).fadeOut();

        });
    });

    // Accept
    $('#application_list').on('click', '.acception', function(event){
        // Update the job application status and show reminded to contact for recruiter
        app_id = event.target.id.split('-')[1];
        console.log(app_id);

        var patch_req = {
            "id": app_id,
            "status": 'Accepted'
        };
        $.ajax({
            url: apiurl + '/api/jobs/' + jid + '/applications/' + app_id + '/',
            method: 'PATCH',
            data: JSON.stringify(patch_req),
            contentType: 'application/json',
            headers: {
                Authorization: 'Token ' + cvconnect_auth_token
            }
        }).error(function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
            console.log("Failed Job Application Patch:", jqXHR.responseText);
        }).success(function(r){
            console.log("Successful Job Application Patch");

            // Reload the page to get proper display
            // this could be done without reloading but requires more api calls which could be slower
            location.reload();

        });
    });

    // Search
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
});