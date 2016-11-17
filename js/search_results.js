function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function updateSearchResults(query) {
    $.getJSON(apiurl + "/api/search/" + query + "/", function(results){
        var result_box = "";
        // Check if we match the subtype with the checkboxes
        var profiles = $("#query-profiles").is(":checked");
        var jobs = $("#query-jobs").is(":checked");
        var skills = $("#query-skills").is(":checked");
        var locations = $("#query-locations").is(":checked");

        // Merge results and then display
        // Filter out anything we don't want first
        var filtered_results = [];
        for (index in results) {
            var result = results[index];
            if (profiles && result.subtype === 'profiles') {
                filtered_results.push(result);
                continue;
            }
            if (jobs && result.subtype === 'jobs') {
                filtered_results.push(result);
                continue;
            }
            if (skills && result.subtype === 'skills') {
                filtered_results.push(result);
                continue;
            }
            if (locations && result.subtype === 'locations') {
                filtered_results.push(result);
                continue;
            }
        }

        // Now we can merge the profile types (profile, skill, location)
        var merged_results = {};
        for (index in filtered_results) {
            var result = filtered_results[index];
            if (result.type === 'profiles') {
                if (merged_results[result.id] == null) {
                    merged_results[result.id] = result;
                    if (result.subtype !== 'profiles') {
                        merged_results[result.id].match = [result.match];
                    }
                } else {
                    try {
                        merged_results[result.id].match.push(result.match);
                    } catch (type_error) {
                        merged_results[result.id].match = [result.match];
                    }
                }
            } else {
                merged_results[result.id] = result;
            }
        }
        var keys = Object.keys(merged_results);
        var values = keys.map(function(x) { return merged_results[x]; });

        for (index in values) {
            var result = values[index];

            result_box += "<div>";

            if (result.type === "profiles") {

                // It requires a link to its profile
                result_box +='<li class="b"> <div class="qf">' + //<a class="qj" href=\"../html/profile.html?username=' + result.id + '\"><img class="qh cu" id="res-img-' + result.id + '" src=""> </a>' +
                '<div class="qg"><center> <a class="qj" href=\"../html/profile.html?username=' + result.id + '\">'+ result.visible_id +'</a><p> Matches: ' + result.match + '</p> </center> </div> </div> </li>';

                //$("#res-img-" + result.id).attr("src", "../../" + result.image);
                //$("#res-img-" + result.id).attr("height", 50);
                //$("#res-img-" + result.id).attr("width", 50);

            } else {
                // It requires a link to its job
                result_box += '<li class="b"> <div class="qf">' +
                '<div class="qg"><center> <a class="qj" href=\"../html/job_display.html?jid=' + result.id + '\">' + result.match + "</a> </center> </div> </div> </li>";
            }

            result_box += "</div";
        }
        $("#search-results").html(result_box);
        return false;
    });
}

$(document).ready(function(){
    var cvconnect_auth_token = localStorage.cvconnect_auth_token;
    if (!cvconnect_auth_token) {
        window.location.href = "../html/not_found.html";
        return false;
    }
    
    // Make a call to the api to get the search results
    
    var query = getParameterByName("query");

    updateSearchResults(query);
    
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

    $(".checkbox-inline").change(function() {
        updateSearchResults(query);
    });
    
    $("#job-postings").click(function(){
        window.location.href = "job_display.html";
        return false;
    });
    
    $("#create-new-job").click(function(){
        var username = localStorage.cvconnect_username;
        
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
