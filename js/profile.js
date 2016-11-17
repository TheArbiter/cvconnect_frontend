function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function getMonthFromString(mon){
   return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
}

function getYear(date){
    if (date == null){
        return "currently";
    }
    return date.split("-")[0];
}

function getJobYear(date){
    if (date == null){
       return "currently"; 
    }
    return date.split("-")[0] + "-" + date.split("-")[1];
}

function edit_cv_part(id){
    //get request
    //serve up part according to type
    //upon clicking save, patch request
    
    var true_id = id.split("-")[2]
    var type = id.split("-")[1];
    
    var username = localStorage.cvconnect_username;
    
    
    $.getJSON(apiurl + "/api/profiles/" + username + "/" + type + "/" + true_id + "/", function(result){
        console.log(result);
        if (type == "skills"){
            $("#edit-fields").html(
            "<input type=\"hidden\" id=\"id\" value=\""+ type+ "-" + true_id+"\">" +
            "<input type=\"text\" id=\"edit-skills\" name='edit_skill'  value=\""+result.name+"\" class=\"form-control\"/>" +
            "<input type=\"text\" id=\"edit-skills-proficiency\" name='proficiency0' value=\""+result.proficiency+"\" class=\"form-control\"/>"
            );
        } else if (type == "education"){
            var start_date = result.date_started.split("-")[0];
            var end_date;
            if (result.date_attained != null){
                end_date = result.date_attained.split("-")[0];
            } else {
                end_date = "";
            }
            $("#edit-fields").html(
            "<input type=\"hidden\" id=\"id\" value=\""+ type+ "-" + true_id+"\">" +
            //"<input type = \"text\" id=\"edit-school-name\" name=\"school_name\" value=\""+result.institution+"\" class=\"form-control\"></div>" +
            /*
            "<label class=\"col-md-4 control-label\" for=\"e_school_name\">School Name</label><div class=\"col-md-8\"><input type=\"text\" id=\"edit-school-name\" name=\"school_name\" value=\""+result.institution+"\" class=\"form-control\"></div>" +
            "<label class=\"col-md-4 control-label\" for=\"dates_attended\">Dates Attended</label><div class=\"col-md-4\"><input id=\"edit-school-start-year\" class=\"date-own form-control\"  type=\"text\" value=\""+start_date+"\"></div>" +
            "<div class=\"col-md-4\"><input id=\"edit-school-end-year\" class=\"date-own form-control\"  type=\"text\" value=\""+end_date+"\"></div>" +
            "<label class=\"col-md-4 control-label\" for=\"degree\">Degree</label><div class=\"col-md-8\"><input id=\"edit-degree\" name=\"degree\" type=\"text\" value=\""+result.degree+"\" class=\"form-control input-md\"></div>" +
            "<label class=\"col-md-4 control-label\" for=\"field_of_study\">Field of Study</label><div class=\"col-md-8\"><input id=\"edit-field-of-study\" name=\"field_of_study\" type=\"text\" value=\""+result.field_of_study+"\" class=\"form-control input-md\"></div>" +
            "<label class=\"col-md-4 control-label\" for=\"activities\">Activities and Societies</label><div class=\"col-md-8\"><textarea class=\"form-control\" id=\"edit-activities\" rows=\"3\">"+result.extra_activities+"</textarea></div>" +
            "<label class=\"col-md-4 control-label\" for=\"school_description\">Description</label><div class=\"col-md-8\"><textarea class=\"form-control\" id=\"edit-school-description\" rows=\"3\">"+result.description+"</textarea></div>" +
            "<div class=\"checkbox\"><label><input type=\"checkbox\" id=\"edit-currently-studying\">I currently Study here</label></div>"
            */
            "<label class=\"col-md-4 control-label\" for=\"e_school_name\">School Name</label><input type=\"text\" id=\"edit-school-name\" name=\"school_name\" value=\""+result.institution+"\" class=\"form-control\">" +
            "<label class=\"col-md-4 control-label\" for=\"dates_attended\">Dates Attended</label><input id=\"edit-school-start-year\" class=\"date-own form-control\"  type=\"text\" value=\""+start_date+"\">" +
            "<input id=\"edit-school-end-year\" class=\"date-own form-control\" type=\"text\" value=\""+end_date+"\">" +
            "<label class=\"col-md-4 control-label\" for=\"degree\">Degree</label><input id=\"edit-degree\" name=\"degree\" type=\"text\" value=\""+result.degree+"\" class=\"form-control input-md\">" +
            "<label class=\"col-md-4 control-label\" for=\"field_of_study\">Field of Study</label><input id=\"edit-field-of-study\" name=\"field_of_study\" type=\"text\" value=\""+result.field_of_study+"\" class=\"form-control input-md\">" +
            "<label class=\"col-md-4 control-label\" for=\"activities\">Activities and Societies</label><textarea class=\"form-control\" id=\"edit-activities\" rows=\"3\">"+result.extra_activities+"</textarea>" +
            "<label class=\"col-md-4 control-label\" for=\"school_description\">Description</label><textarea class=\"form-control\" id=\"edit-school-description\" rows=\"3\">"+result.description+"</textarea>" +
            "<div class=\"checkbox\"><label><input type=\"checkbox\" id=\"edit-currently-studying\">I currently Study here</label></div>"
            
            
            );
            if (end_date == ""){
                $( "#edit-currently-studying" ).prop( "checked", true );
                document.getElementById("edit-school-end-year").disabled = true;
            }
            
        } else {
            var start_month = result.start_date.split("-")[0];
            var end_month;
            if (result.end_date != null){
                end_month = result.end_date.split("-")[0];
            } else {
                end_month = "";
            }
            
            $("#edit-fields").html(
            "<input type=\"hidden\" id=\"id\" value=\""+ type+ "-" + true_id+"\">" +
            "<label class=\"col-md-4 control-label\" for=\"company_name\">Company Name</label><input id=\"edit-company-name\" name=\"company_name\" type=\"text\" value=\""+result.employer+"\" class=\"form-control input-md\">" +
            "<label class=\"col-md-4 control-label\" for=\"title\">Title</label><input id=\"edit-title\" name=\"title\" type=\"text\" value=\""+result.role+"\" class=\"form-control input-md\">" +
            "<label class=\"col-md-4 control-label\" for=\"location\">Location</label><input id=\"edit-location\" name=\"location\" type=\"text\" value=\""+result.location+"\" class=\"form-control input-md\">" +
            "<label class=\"col-md-4 control-label\" for=\"time_period\">Time Period From</label><select class=\"form-control\" id=\"edit-start-month\"><option>January</option><option>February</option><option>March</option><option>April</option><option>May</option>" +
            "<option>June</option><option>July</option><option>August</option><option>September</option><option>October</option><option>November</option><option>December</option></select>" + 
            "<input id=\"edit-time-period-start-year\" class=\"date-own form-control\"  type=\"text\" value=\""+start_month+"\">" +
            "<label class=\"col-md-4 control-label\" for=\"time_period\">Time Period To</label><select class=\"form-control\" id=\"edit-end-month\"><option>January</option><option>February</option><option>March</option><option>April</option><option>May</option>" +
            "<option>June</option><option>July</option><option>August</option><option>September</option><option>October</option><option>November</option><option>December</option></select>" + 
            "<input id=\"edit-time-period-end-year\" class=\"date-own form-control\"  type=\"text\" value=\""+end_month+"\">" +
            "<label class=\"col-md-4 control-label\" for=\"employment_description\">Description</label><textarea class=\"form-control\" id=\"edit=employment-description\" rows=\"3\">"+result.achievements+"</textarea>" +
            "<label><input type=\"checkbox\" id=\"edit-currently-working\">I currently Work here</label>"
            /*
            "<input type=\"hidden\" id=\"id\" value=\""+ type+ "-" + true_id+"\">" +
            "<label class=\"col-md-4 control-label\" for=\"company_name\">Company Name</label><div class=\"col-md-8\"><input id=\"edit-company-name\" name=\"company_name\" type=\"text\" value=\""+result.employer+"\" class=\"form-control input-md\"></div>" +
            "<label class=\"col-md-4 control-label\" for=\"title\">Title</label><div class=\"col-md-8\"><input id=\"edit-title\" name=\"title\" type=\"text\" value=\""+result.role+"\" class=\"form-control input-md\"></div>" +
            "<label class=\"col-md-4 control-label\" for=\"location\">Location</label><div class=\"col-md-8\"><input id=\"edit-location\" name=\"location\" type=\"text\" value=\""+result.location+"\" class=\"form-control input-md\"></div>" +
            "<div class=\"form-group\"><label class=\"col-md-4 control-label\" for=\"time_period\">Time Period</label><div class=\"col-md-4\"><select class=\"form-control\" id=\"edit-start-month\"><option>January</option><option>February</option><option>March</option><option>April</option><option>May</option>" +
            "<option>June</option><option>July</option><option>August</option><option>September</option><option>October</option><option>November</option><option>December</option></select></div>" + 
            "<div class=\"col-md-4\"><input id=\"edit-time-period-start-year\" class=\"date-own form-control\"  type=\"text\" value=\""+start_month+"\"></div>" +
            "<div class=\"form-group\"><label class=\"col-md-4 control-label\" for=\"time_period\">Time Period</label><div class=\"col-md-4\"><select class=\"form-control\" id=\"edit-end-month\"><option>January</option><option>February</option><option>March</option><option>April</option><option>May</option>" +
            "<option>June</option><option>July</option><option>August</option><option>September</option><option>October</option><option>November</option><option>December</option></select></div>" + 
            "<div class=\"col-md-4\"><input id=\"edit-time-period-end-year\" class=\"date-own form-control\"  type=\"text\" value=\""+end_month+"\"></div>" +
            "<label class=\"col-md-4 control-label\" for=\"employment_description\">Description</label><div class=\"col-md-8\"><textarea class=\"form-control\" id=\"edit=employment-description\" rows=\"3\">"+result.achievements+"</textarea></div>" +
            "<div class=\"checkbox\"><label><input type=\"checkbox\" id=\"edit-currently-working\">I currently Work here</label></div>"*/
            );
            
            if (end_month == ""){
                $( "#edit-currently-working" ).prop( "checked", true );
                document.getElementById("edit-time-period-end-year").disabled = true;
                document.getElementById("edit-end-month").disabled = true;
            }
            
        }
        $("#myModal").modal('toggle');
        $('#edit-cv-modal').modal('toggle');

    }).fail(function(){
        console.log("error");
    }).success(function() {
        
    });
    
    return false;
}

function delete_cv_part(id){
    var r = confirm("Are you sure you want to delete this item?");
    if (r == true) {
        var type = id.split("-")[0];
        var id_of_delete = id.split("-")[1];
        var username = localStorage.cvconnect_username;
        console.log(id);
        if (type === 'skill'){
            type = 'skills';
        }

        console.log(apiurl + "/api/profiles/" + username + "/" + type + "/" + id_of_delete + "/");

        $.ajax({
            url: apiurl + "/api/profiles/" + username + "/" + type + "/" + id_of_delete + "/",
            type: "DELETE",
        }).error(function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
            console.log("Failed to delete " + type +": ", jqXHR.responseText);
        }).success(function(suc){
            console.log("Successfully deleted " + type);
            $("#" + id + "-container").hide();
            console.log("hid " + id + "-container");
        });
    } 

    return false;
}

File.prototype.convertToBase64 = function(callback){
        var reader = new FileReader();
        reader.onload = function(e) {
             callback(e.target.result)
        };
        reader.onerror = function(e) {
             callback(null);
        };
        reader.readAsDataURL(this);
};

function buildFeedPost(username, logged_in_user){

    $("#feed").html('');

    if (username === logged_in_user) {
        $("#feed").append(
            '<li id="feed-input" class="qf b aml">' +
                  '<div class="input-group">' +
                    '<input type="text" class="form-control" placeholder="Message" id="new_feed">' +
                    '<div class="fj">' +
                      '<button id="feed-submit" type="submit" class="cg fm">' +
                        '<span class="h">Post</span>' +
                      '</button>' +
                    '</div>' +
                  '</div>' +
                '</li>'
        );
    }

    // Load the personal feed
    $.getJSON(apiurl + "/api/profiles/" + username + "/feedposts/", function(feedposts){

        for (index in feedposts) {
            var feedpost = feedposts[index];
            $("#feed").append(
                '<li class="qf b aml">' +
                  '<a class="qj" href="#">' +
                    '<img' +
                      'class="oh cu"' +
                      'id="profile-image-feed"' +
                      'src="">' +
                  '</a>' +
                  '<div class="qg">' +
                    '<div class="qn">' +
                      '<small class="eg dp">' + feedpost.created + '</small>' +
                      '<!--<h1 id="username"></h1> -->' +
                      '<h5>' + feedpost.full_name + '</h5>' +
                    '</div>' +
                    '<p>' +
                      feedpost.text +
                    '</p>' +
                  '</div>' +
                '</li>'
            );
        }
    });
}

$(document).ready(function(){
    // Make a call to the api to get the profile data

    var cvconnect_auth_token = localStorage.cvconnect_auth_token;
    var username = getParameterByName("username");
    
    var logged_in_user = localStorage.cvconnect_username;
    var profile_id;
    
    if (username == null){
        username = logged_in_user;
    }

    if (!cvconnect_auth_token) {
        window.location.href = "../html/not_found.html";
        return false;
    } else {
        if (username === logged_in_user){
            // Logged in users shouldn't see a follow button on their profile
            $('#follow_button').hide();
        } else {
            // Users shouldn't see private info on other users pages
            $('#edit_cv_tab').hide();
            $('#view_feed_tab').hide();
            $('#jobs_tab').hide();
            $('#alert').hide();
            $('#update-image-box').hide();
        }

        $.getJSON(apiurl + "/api/profiles/" + username + "/", function(result){
            $("#username").append(result.full_name);
            $("#mr-position").append(result.current_position);
            $("#mr-edu").append(result.current_edu);
            $("#mr-job").append(result.current_company);
            $("#country-from").append(result.country);
            $("#contact").append(result.email);
            profile_id = result.id;

            // if the current user follows the users profile, then we need
            // to make sure the follow button says following
            if ($.inArray(logged_in_user, result.connections) >= 0){
                $("#follow_button").html('Unfollow');
            }


        }).fail(function(){
            // If the user does not exist, go to the 404 page
            window.location.href = "../html/not_found.html";
        });

        $.getJSON(apiurl + "/api/profiles/" + username + "/image/", function(result){

            $("#profile-image-slot").attr("src", result.image);
            $("#profile-image-slot").attr("height", 100);
            $("#profile-image-slot").attr("width", 100);

            $("#profile-image-feed").attr("src", result.image);
            $("#profile-image-feed").attr("height", 50);
            $("#profile-image-feed").attr("width", 50);

        });

        $.getJSON(apiurl + "/api/profiles/" + username + "/employment/", function(jobs){
            if (username === logged_in_user){
                for (index in jobs) {
                    var employment = jobs[index];
                    
                    $("#job-content").append(
                        "<div id=\"employment-"+employment.id+"-container\">" +
                        "<a class=\"fa fa-trash\" id=\"employment-"+employment.id+"\" onclick=\"delete_cv_part(id);\" href=\"#\"><i href=\"#\" aria-hidden=\"true\"></i></a>" +
                        "<a class=\"fa fa-pencil-square-o\" id=\"edit-employment-"+employment.id+"\" onclick=\"edit_cv_part(id);\" href=\"#\"><i href=\"#\" aria-hidden=\"true\"></i></a>" +
                        "<p><h4>" + employment.employer + "</h4>" +
                        "<h5><b>Title: </b>" + employment.role + "</h5>" +
                        "<h5>From: " + getJobYear(employment.start_date) + " to " + getJobYear(employment.end_date) + "</h5>" +
                        "<h5><b>Description: </b>" + employment.achievements + "</h5></p>"
                    );
                }
            } else {
                for (index in jobs) {
                    var employment = jobs[index];
                    $("#job-content").append(
                        "<p><h4>" + employment.employer + "</h5>" +
                        "<h5><b>Title: </b>" + employment.role + "</h5>" +
                        "<h5>From: " + employment.start_date + " to " + employment.end_date + "</h5>" +
                        "<h5><b>Description: </b>" + employment.achievements + "</h5></p>"
                    );
                }
            }
        });
    }

    $.getJSON(apiurl + "/api/profiles/" + username + "/education/", function(education){
        if (username === logged_in_user){
            for (index in education) {
                var edu = education[index];
                $("#education-content").append(
                    "<div id=\"education-"+edu.id+"-container\">" +
                    "<a class=\"fa fa-trash\" id=\"education-"+edu.id+"\" onclick=\"delete_cv_part(id);\" href=\"#\"><i href=\"#\" aria-hidden=\"true\"></i></a>" +
                    "<a class=\"fa fa-pencil-square-o\" id=\"edit-education-"+edu.id+"\" onclick=\"edit_cv_part(id);\" href=\"#\"><i href=\"#\" aria-hidden=\"true\"></i></a>" +
                    "<h4>" + edu.institution + "</h4>" +
                    "<h5>" + edu.degree + "(" + edu.field_of_study + ")</h5>" +
                    "<h5>From " + getYear(edu.date_started) + " to " + getYear(edu.date_attained) + "</h5>" +
                    "<h5>Activities and Societies: " + edu.extra_activities + "</h5>" +
                    "<h5>Description: " + edu.description + "</h5>"
                );
            }
        } else {
            for (index in education) {
                var edu = education[index];
                $("#education-content").append(
                    "<h4>" + edu.institution + "</h4>" +
                    "<h5>" + edu.degree + "(" + edu.field_of_study + ")</h5>"
                );
            }
        }
    });

    $.getJSON(apiurl + "/api/profiles/" + username + "/skills/", function(skills){
        if (username === logged_in_user) {
            for (index in skills) {
                var skill = skills[index];
                var stars = "<i class=\"fa fa-star\" aria-hidden=\"true\"></i>".repeat(skill.proficiency);

                $("#skills-content").append(
                    "<div id=\"skill-"+skill.id+"-container\">" +
                    "<a class=\"fa fa-trash\" id=\"skill-"+skill.id+"\" onclick=\"delete_cv_part(id);\" href=\"#\"><i href=\"#\" aria-hidden=\"true\"></i></a>" +
                    "<a class=\"fa fa-pencil-square-o\" id=\"edit-skills-"+skill.id+"\" onclick=\"edit_cv_part(id);\" href=\"#\"><i href=\"#\" aria-hidden=\"true\"></i></a>" +
                    "<h4>" + skill.name + "</h4><h5>" + stars + "</h5></div>"
                );
            }
        } else {
            for (index in skills) {
                var skill = skills[index];

                var stars = "<i class=\"fa fa-star\" aria-hidden=\"true\"></i>".repeat(skill.proficiency);

                $("#skills-content").append(
                    "<div id=\"skill-"+skills[index].id+"-container\"><h4>" + skill.name + "</h4><h5>" + stars + "</h5></div>"
                );
            }
        }
    });

    $.getJSON(apiurl + "/api/profiles/" + username + "/connections/", function(connections){
        for (index in connections) {
            var connection = connections[index];
            var imagepath = "qj";
            $("#connections-content").append(
                "<p id=\"connectionpara-" + connection.id + "\"><img id=\"connection-" + connection.id + "\" class=\"qu cu\" src=\"\"" +
                "<a href=\"?username=" + connection.username + "\"<h4> " + connection.full_name + "</h4>" +
                "<button id='unfollow-" + connection.username + "' style=\"float:right;\" class=\"cg ts fx unfollowbtn\">" +
                        "<span class=\"h vc\"></span> Unfollow</button></p>"
            );

            $("#connection-" + connection.id).attr("src", connection.image);
            $("#connection-" + connection.id).attr("height", 50);
            $("#connection-" + connection.id).attr("width", 50);
        }
    });

    $.getJSON(apiurl + "/api/profiles/" + logged_in_user + "/recommendations/", function(recommendations){

        var count = 0;
        for (index in recommendations) {
            count = count + 1;
            var recommendation = recommendations[index];
            console.log("image is:");
            console.log(recommendation.image);
            $("#recommendations-list").append(
                "<li class=\"qf\">" +
                  "<a class=\"qj\" href=\"?username=" + recommendation.username + "\">" +
                    "<img id=\"rec-" + recommendation.id + "\"" +
                      "class=\"qh cu\"" +
                      "src=\"\">" +
                  "</a>" +
                  "<div class=\"qg\">" +
                    "<a class=\"qj\" href=\"?username=" + recommendation.username + "\"><strong>" + recommendation.full_name + "</strong></a>" +
                    "<div class=\"aoa\">" +
                      "<button id='follow-" + recommendation.username + "' class=\"cg ts fx followbtn\">" +
                        "<span class=\"h vc\"></span> Follow</button>" +
                    "</div>" +
                  "</div>" +
                "</li>"
            );

            $("#rec-" + recommendation.id).attr("src", recommendation.image);
            $("#rec-" + recommendation.id).attr("height", 50);
            $("#rec-" + recommendation.id).attr("width", 50);
        }

        if (count == 0) {
            $("#recommendations-list").append("No Recommendations Available");
        }
    });

    buildFeedPost(username, logged_in_user);

    $("#feed").on('click', '#feed-submit', function(){
        var content = $("#new_feed").val();
        $("#feed-submit").attr('disabled', true);
        var feed_request = {
            "text": content,
            "user": username
        }

        $.ajax({
            url: apiurl + "/api/profiles/" + username + "/feedposts/",
            method: "POST",
            data: JSON.stringify(feed_request),
            contentType: 'application/json',
        }).error(function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
            console.log("Failed to submit post:", jqXHR.responseText);
        }).success(function(suc){
            console.log("Successfully submitted post:", suc);
            $("#feed-submit").attr('disabled', false);
            $("#new_feed").val('');
            buildFeedPost(username, logged_in_user);
        });
        return false;
    });

    if (username === logged_in_user) {
        $.getJSON(apiurl + "/api/profiles/" + logged_in_user + "/applications/", function(apps) {
            var count = 0;
            for (index in apps) {
                count = count + 1;
                var app = apps[index];

                var colormap = {
                    'Pending': 'orange',
                    'Accepted': 'green',
                    'Rejected': 'red'
                };

                var messagemap = {
                    'Pending': 'Pending',
                    'Accepted': 'Accepted: Wait for contact',
                    'Rejected': 'Rejected'
                };

                $("#user-jobs").append("<div style=\"color:" + colormap[app.status] + ";\">" +
                                         "<p>" + app.job_posting_position +
                                         " @ " + app.job_posting_company + "</p>" +
                                         "<p>" + messagemap[app.status] + "</p>" +
                                       "</div>")
            }

            if (count == 0){
                $("#user-jobs").append("No Job Applications");
            }
        });
    } else {
        $("#user-jobs").hide();
    }

    $("#recommendations-list").on('click', '.followbtn', function(event) {
        var target_user = event.target.id.split('-')[1];

        // the logged in user is trying to follow target_user
        var connect_request = {
            "first": target_user,
            "second": logged_in_user
        };

        console.log("Sending request");
        console.log(connect_request);

        $.ajax({
            url: apiurl + "/api/connect/",
            method: "POST",
            data: JSON.stringify(connect_request),
            contentType: 'application/json',
        }).error(function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
            console.log("Failed to follow user:", jqXHR.responseText);
        }).success(function(suc){
            $("#follow-" + target_user).html('Following');
            console.log("Successfully followed user:", suc);
        });
        return false;
    });

    $("#connections-content").on('click', '.unfollowbtn', function(event) {
        var target_user = event.target.id.split('-')[1];


        // the logged in user is trying to follow target_user
        var unconnect_request = {
            "first": target_user,
            "second": logged_in_user
        };

        console.log("Sending request");
        console.log(unconnect_request);

        $.ajax({
            url: apiurl + "/api/deconnect/",
            method: "POST",
            data: JSON.stringify(unconnect_request),
            contentType: 'application/json',
        }).error(function(jqXHR, textStatus, errorThrown) {
            alert(jqXHR.responseText);
            console.log("Failed to unfollow user:", jqXHR.responseText);
        }).success(function(suc){
            location.reload();
            console.log("Successfully unfollowed user:", suc);
        });
        return false;
    });

    $("#follow_button").click(function(){

        var value = $.trim($("#follow_button").text());

        // the logged in user is trying to follow username
        var connect_request = {
            "first": username,
            "second": logged_in_user
        };

        console.log("Sending request");
        console.log(connect_request);

        if (value === "Follow") {
            $.ajax({
                url: apiurl + "/api/connect/",
                method: "POST",
                data: JSON.stringify(connect_request),
                contentType: 'application/json',
            }).error(function(jqXHR, textStatus, errorThrown) {
                alert("Failed to follow this user");
                console.log("Failed to follow user:", jqXHR.responseText);
            }).success(function(suc){
                $("#follow_button").html('Unfollow');
                console.log("Successfully followed user:", suc);
            });
        } else {
            $.ajax({
                url: apiurl + "/api/deconnect/",
                method: "POST",
                data: JSON.stringify(connect_request),
                contentType: 'application/json',
            }).error(function(jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
                console.log("Failed to unfollow user:", jqXHR.responseText);
            }).success(function(suc){
                $("#follow_button").html('Follow');
                console.log("Successfully unfollowed user:", suc);
            });
        }


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

    $("#add-education").click(function(e){
        var school_name = $("#school_name").val();
        var degree = $("#degree").val();
        var school_start_year = $("#school_start_year").val();
        var school_end_year = $("#school_end_year").val();

        console.log(school_start_year);
        console.log(school_end_year)

        var edu_request = {
            "institution": school_name,
            "degree": degree,
            "date-attained": school_end_year + "-01-01",
            "achievements": "",
            "profile": profile_id
        };

        console.log("Sending request");
        console.log(edu_request);

        // Sends the skill data to the api to create a skill entry
        $.ajax({
            url: apiurl + "/api/profiles/" + logged_in_user + "/education/",
            method: "POST",
            data: JSON.stringify(skill_request),
            contentType: 'application/json',
        }).error(function(jqXHR, textStatus, errorThrown) {
            alert("Failed to create education history");
            console.log("Failed EduHist Creation:", jqXHR.responseText);
        }).success(function(edu){
            console.log("Successful EduHist Creation:", edu);

        });
        return false;

    });

      $('.date-own').datepicker({

         minViewMode: 2,

         format: 'yyyy'

       });

    $("#save-skill").click(function(e){
        var skill_name = $("#skills_input").val();
        var skills_proficiency = parseInt($("#skills_proficiency").val());
        
        if (skills_proficiency <= 0 ||skills_proficiency > 5){
            alert("Proficiency must be between 1 and 5. Please re-enter.");
            return false;
        }
        
        var skill_request = {
            "name": skill_name,
            "profile": profile_id,
            "proficiency": skills_proficiency
        };

        console.log("Sending request");
        console.log(skill_request);

        // Sends the skill data to the api to create a skill entry
        $.ajax({
            url: apiurl + "/api/profiles/" + logged_in_user + "/skills/",
            method: "POST",
            data: JSON.stringify(skill_request),
            contentType: 'application/json',
        }).error(function(jqXHR, textStatus, errorThrown) {
            alert("Failed to add skill");
            console.log("Failed Skill Creation:", jqXHR.responseText);
        }).success(function(skill){
            console.log("Successful Skill Creation:", skill);

            var stars = "<i class=\"fa fa-star\" aria-hidden=\"true\"></i>".repeat(skill.proficiency);

            // Add the skill to the skills list
            $("#skills-content").append(
                    "<div id=\"skill-"+skill.id+"-container\">" +
                    "<a class=\"fa fa-trash\" id=\"skill-"+skill.id+"\" onclick=\"delete_cv_part(id);\" href=\"#\">" +
                    "<a class=\"fa fa-pencil-square-o\" id=\"edit-skills-"+skill.id+"\" onclick=\"edit_cv_part(id);\" href=\"#\"><i href=\"#\" aria-hidden=\"true\"></i></a>" +
                    "<i href=\"#\" aria-hidden=\"true\"></i></a><h4>" + skill.name + "</h4><h5>" + stars + "</h5></div>"
            );

            document.getElementById("skills_input").value = "";
            document.getElementById("skills_proficiency").value = "";
            alert("Details saved");

        });
        return false;
    });

    $("#save-employment").click(function(e){
        var employment_name = $("#company_name").val();
        var employment_title = $("#title").val();
        var employment_location = $("#location").val();
        var employment_time_start_month = $("#start_month").val();
        var employment_time_start_year = $("#time_period_start_year").val();
        var employment_time_end_month = $("#end_month").val();
        var employment_time_end_year = $("#time_period_end_year").val();
        var employment_description = $("#employment_description").val();

        var start_date = employment_time_start_year + "-" + getMonthFromString(employment_time_start_month) + "-01";
        var end_date = employment_time_end_year + "-" + getMonthFromString(employment_time_end_month) + "-01";

        if (document.getElementById('currently_working').checked){
            end_date = null;
        }

        //need to input location
        var employment_request = {
            "employer": employment_name,
            "location": employment_location,
            "profile": profile_id,
            "role": employment_title,
            "start_date": start_date,
            "end_date": end_date,
            "achievements": employment_description
        };

        console.log("Sending request");
        console.log(employment_request);

        // Sends the employment data to the api to create an employment entry
        $.ajax({
            url: apiurl + "/api/profiles/" + logged_in_user + "/employment/",
            method: "POST",
            data: JSON.stringify(employment_request),
            contentType: 'application/json',
        }).error(function(jqXHR, textStatus, errorThrown) {
            alert("Failed to create employment record");
            console.log("Failed Employment Creation:", jqXHR.responseText);
        }).success(function(employment){
            console.log("Successful Employment Creation:", employment);
            
            // Add the employment to the employment list
            $("#job-content").append(
                    "<div id=\"employment-"+employment.id+"-container\"><a class=\"fa fa-trash\" id=\"employment-"+employment.id+"\" onclick=\"delete_cv_part(id);\" href=\"#\">" +
                    "<i href=\"#\" aria-hidden=\"true\"></i></a>" +
                    "<h4>" + employment.employer + "</h4>" +
                     "<h5><b>Title: </b>" + employment.role + "</h5>" +
                     "<h5>From: " + getJobYear(employment.start_date) + " to " + getJobYear(employment.end_date) + "</h5>" +
                     "<h5><b>Description: </b>" + employment.achievements + "</h5></p>"
            );

            document.getElementById("company_name").value = "";
            document.getElementById("title").value = "";
            document.getElementById("location").value = "";
            document.getElementById("start_month").value = "";
            document.getElementById("time_period_start_year").value = "";
            document.getElementById("end_month").value = "";
            document.getElementById("time_period_end_year").value = "";
            document.getElementById("employment_description").value = "";
            alert("Details saved");

        });
        return false;
    });

    $("#save-education").click(function(e){
        var school_name = $("#school_name").val();
        var school_time_start_year = $("#school_start_year").val() + "-01-01";
        var school_time_end_year = $("#school_end_year").val() + "-01-01";
        var school_degree = $("#degree").val();
        var school_field_of_study = $("#field_of_study").val();
        var school_activities =$("#activities").val();
        var school_description = $("#school_description").val();

        if (document.getElementById('currently_studying').checked){
            school_time_end_year = null;
        }
        
        var education_request = {
            "profile": profile_id,
            "institution": school_name,
            "degree": school_degree,
            "date_started": school_time_start_year,
            "date_attained": school_time_end_year,
            "achievements": "none",
            "field_of_study": school_field_of_study,
            "extra_activities": school_activities,
            "description": school_description
        };

        console.log("Sending request");
        console.log(education_request);

        // Sends the skill data to the api to create a skill entry
        $.ajax({
            url: apiurl + "/api/profiles/" + logged_in_user + "/education/",
            method: "POST",
            data: JSON.stringify(education_request),
            contentType: 'application/json',
        }).error(function(jqXHR, textStatus, errorThrown) {
            alert("Failed to create education record");
            console.log("Failed Education Creation:", jqXHR.responseText);
        }).success(function(education){
            console.log("Successful Education Creation:", education);
            
            // Add education to education list
            $("#education-content").append(
                "<div id=\"education-"+education.id+"-container\"><a class=\"fa fa-trash\" id=\"education-"+education.id+"\" onclick=\"delete_cv_part(id);\" href=\"#\">" +
                "<i href=\"#\" aria-hidden=\"true\"></i></a>" +
                "<h4>" + education.institution + "</h4>" +
                "<h5>" + education.degree + "(" + education.field_of_study + ")</h5>" + 
                "<h5>From " + getYear(education.date_started) + " to " + getYear(education.date_attained) + "</h5>" +
                "<h5>Activities and Societies: " + education.extra_activities + "</h5>" +
                "<h5>Description: " + education.description + "</h5>"
            );

            document.getElementById("school_name").value = "";
            document.getElementById("school_start_year").value = "";
            document.getElementById("school_end_year").value = "";
            document.getElementById("degree").value = "";
            document.getElementById("field_of_study").value = "";
            document.getElementById("activities").value = "";
            document.getElementById("school_description").value = "";
            alert("Details saved");

        });
        return false;
    });
    
    $("#add-skill").click(function(e){
        var skill_name = $("#skills_input").val();

        var skill_request = {
            "name": skill_name,
            "profile": profile_id,
            "proficiency": 0
        };

        console.log("Sending request");
        console.log(skill_request);

        // Sends the skill data to the api to create a skill entry
        $.ajax({
            url: apiurl + "/api/profiles/" + logged_in_user + "/skills/",
            method: "POST",
            data: JSON.stringify(skill_request),
            contentType: 'application/json',
        }).error(function(jqXHR, textStatus, errorThrown) {
            alert("Failed to add skill");
            console.log("Failed Skill Creation:", jqXHR.responseText);
        }).success(function(skill){
            console.log("Successful Skill Creation:", skill);

            // Add the skill to the skills list
	    //'<div class="progress"> <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width: 40%;" data-toggle="tooltip" data-placement="top" title="'+skill.name+'"> <span class="progress-type">'+skill.name+'</span> </div> </div>'
            //
            $("#skills-content").append(
              "<div id=\"skill-"+skill.id+"-container\"><a class=\"fa fa-trash\" id=\"skill-"+skill.id+"\" onclick=\"delete_cv_part(id);\" href=\"#\"><i href=\"#\" aria-hidden=\"true\"></i></a><h4>" + skill.name + "</h4><h5>" + skills.proficiency + "</h5></div>"
            );

            document.getElementById("skills_input").value = "";
            //for use when we add proficiency depending how we do it
            //document.getElementById("proficiency").value = "";

        });
        return false;
    });

    $("#homelink").click(function(){
        if (username != logged_in_user){
            window.location.href = "profile.html";
        } else {
            window.location.href = "#";
        }       
        return false;
    });
    
    $("#profile-link").click(function(){
        if (username != logged_in_user){
            window.location.href = "profile.html";
        } else {
            window.location.href = "#";
        }
        return false;
    });
    
    $("#cvconnect-banner").click(function(){
        if (username != logged_in_user){
            window.location.href = "profile.html";
        } else {
            window.location.href = "#";
        }
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

    var encoded = "";
    $("#profile-pic-input").on('change',function(){
            var selectedFile = this.files[0];
            selectedFile.convertToBase64(function(base64){
                encoded = base64;
            })
        });

    $("#profile-pic-submit").click(function(){
        var r = confirm("Are you sure you want to change your profile picture? It will delete your previous picture.");
        if (r == true) {         
            // waits for encoded to be created, this is kind of weird since it's async
            while (encoded === "") {}

            //console.log("submitted");
            //console.log(encoded);

            // send the image to the api
            $.ajax({
                url: apiurl + "/api/profiles/" + logged_in_user + "/image/",
                method: "POST",
                data: JSON.stringify({'image': encoded}),
                contentType: 'application/json',
            }).error(function(jqXHR, textStatus, errorThrown) {
                alert(jqXHR.responseText);
                console.log("Failed Image Creation:", jqXHR.responseText);
            }).success(function(im){
                console.log("Successful Image Creation:", im);

                $("#profile-image-slot").attr("src", im.image);
                $("#profile-image-slot").attr("height", 100);
                $("#profile-image-slot").attr("width", 100);

                $("#profile-image-feed").attr("src", im.image);
                $("#profile-image-feed").attr("height", 50);
                $("#profile-image-feed").attr("width", 50);
            });

            console.log("end submit");
        }
        return false;
    });
    
    $('#currently_studying').click(function() {
        if(document.getElementById('currently_studying').checked) {
            document.getElementById("school_end_year").disabled = true;
        } else {
            document.getElementById("school_end_year").disabled = false;
        }
    });
    
    $('#currently_working').click(function() {
        if(document.getElementById('currently_working').checked) {
            document.getElementById("time_period_end_year").disabled = true;
            document.getElementById("end_month").disabled = true;
            
        } else {
            document.getElementById("time_period_end_year").disabled = false;
            document.getElementById("end_month").disabled = false;
        }
    });
    
    $("#edit-fields").on("click", "#edit-currently-studying", function(){
        if(document.getElementById("edit-currently-studying").checked) {
            document.getElementById("edit-school-end-year").disabled = true;
        } else {
            document.getElementById("edit-school-end-year").disabled = false;
        }
    });
    
    $("#edit-fields").on("click", "#edit-currently-working", function(){
        if(document.getElementById('edit-currently-working').checked) {
            document.getElementById("edit-time-period-end-year").disabled = true;
            document.getElementById("edit-end-month").disabled = true;
        } else {
            document.getElementById("edit-time-period-end-year").disabled = false;
            document.getElementById("edit-end-month").disabled = false;
        }
    });
       
    $("#close-edit-cv").click(function() {
        $("#myModal").modal('toggle');
    });
    
    $("#save-edit-cv").click(function() {
        var id = $("#id").val();
        var type = id.split("-")[0];
        var true_id = id.split("-")[1];
        
        if (type == "skills"){
            var skill_name = $("#edit-skills").val();
            var skills_proficiency = parseInt($("#edit-skills-proficiency").val());
            
            if (skills_proficiency <= 0 ||skills_proficiency > 5){
                alert("Proficiency must be between 1 and 5. Please re-enter.");
                return false;
            }
            
            var skill_request = {
                "name": skill_name,
                "profile": profile_id,
                "proficiency": skills_proficiency
            };

            // Sends the skill data to the api to create a skill entry
            $.ajax({
                url: apiurl + "/api/profiles/" + logged_in_user + "/skills/" + true_id + "/",
                method: "PATCH",
                data: JSON.stringify(skill_request),
                contentType: 'application/json',
            }).error(function(jqXHR, textStatus, errorThrown) {
                alert("Failed to add skill");
                console.log("Failed Skill Creation:", jqXHR.responseText);
            }).success(function(skill){
                console.log("Successful Skill Creation:", skill);
                location.reload(); 

            });
        } else if (type == "education"){
            var school_name = $("#edit-school-name").val();
            var school_time_start_year = $("#edit-school-start-year").val() + "-01-01";
            var school_time_end_year = $("#edit-school-end-year").val() + "-01-01";
            var school_degree = $("#edit-degree").val();
            var school_field_of_study = $("#edit-field-of-study").val();
            var school_activities =$("#edit-activities").val();
            var school_description = $("#edit-school-description").val();

            if (document.getElementById('edit-currently-studying').checked){
                console.log("Education is currently checked");
                school_time_end_year = null;
            }
            
            var education_request = {
                "profile": profile_id,
                "institution": school_name,
                "degree": school_degree,
                "date_started": school_time_start_year,
                "date_attained": school_time_end_year,
                "achievements": "none",
                "field_of_study": school_field_of_study,
                "extra_activities": school_activities,
                "description": school_description
            };

            console.log("Sending request");
            console.log(education_request);

            // Sends the skill data to the api to create a skill entry
            $.ajax({
                url: apiurl + "/api/profiles/" + logged_in_user + "/education/" + true_id + "/",
                method: "PATCH",
                data: JSON.stringify(education_request),
                contentType: 'application/json',
            }).error(function(jqXHR, textStatus, errorThrown) {
                alert("Failed to create education record");
                console.log("Failed Education Creation:", jqXHR.responseText);
            }).success(function(education){
                console.log("Successful Education Creation:", education);
                location.reload();

            });
        } else {
            var employment_name = $("#edit-company-name").val();
            var employment_title = $("#edit-title").val();
            var employment_location = $("#edit-location").val();
            var employment_time_start_month = $("#edit-start-month").val();
            var employment_time_start_year = $("#edit-time-period-start-year").val();
            var employment_time_end_month = $("#edit-end-month").val();
            var employment_time_end_year = $("#edit-time-period-end-year").val();
            var employment_description = $("#edit-employment-description").val();

            var start_date = employment_time_start_year + "-" + getMonthFromString(employment_time_start_month) + "-01";
            var end_date = employment_time_end_year + "-" + getMonthFromString(employment_time_end_month) + "-01";

            if (document.getElementById('edit-currently-working').checked){
                end_date = null;
            }

            //need to input location
            var employment_request = {
                "employer": employment_name,
                "location": employment_location,
                "profile": profile_id,
                "role": employment_title,
                "start_date": start_date,
                "end_date": end_date,
                "achievements": employment_description
            };

            console.log("Sending request");
            console.log(employment_request);

            // Sends the employment data to the api to create an employment entry
            $.ajax({
                url: apiurl + "/api/profiles/" + logged_in_user + "/employment/" + true_id + "/",
                method: "PATCH",
                data: JSON.stringify(employment_request),
                contentType: 'application/json',
            }).error(function(jqXHR, textStatus, errorThrown) {
                alert("Failed to create employment record");
                console.log("Failed Employment Creation:", jqXHR.responseText);
            }).success(function(employment){
                console.log("Successful Employment Creation:", employment);               
                location.reload();

            });
        }     
    });
});
